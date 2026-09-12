from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.models import ActivityLog, Customer, Note, Order, OrderItem, Payment, Product


def business_snapshot(db: Session) -> dict:
    """High-level KPIs for 'give me today's business summary.'"""
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    total_revenue = db.query(
        func.coalesce(func.sum(Order.total_amount), 0)
    ).scalar()
    overdue_count = (
        db.query(Payment).filter(Payment.status == "overdue").count()
    )
    overdue_total = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(Payment.status == "overdue")
        .scalar()
    )

    return {
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "overdue_payment_count": overdue_count,
        "overdue_payment_total": float(overdue_total),
    }


def find_customer(db: Session, name: str) -> list[dict]:
    """Case-insensitive partial name match for 'find Ahmed Khan.'"""
    matches = db.query(Customer).filter(Customer.name.ilike(f"%{name}%")).all()
    return [
        {"id": c.id, "name": c.name, "phone": c.phone, "email": c.email}
        for c in matches
    ]


def overdue_payments(db: Session) -> list[dict]:
    """Payments that are late — status='overdue' only, not 'pending'."""
    rows = (
        db.query(Payment, Order, Customer)
        .join(Order, Payment.order_id == Order.id)
        .join(Customer, Order.customer_id == Customer.id)
        .filter(Payment.status == "overdue")
        .order_by(Payment.due_date.asc())
        .all()
    )
    return [
        {
            "payment_id": payment.id,
            "order_id": order.id,
            "customer_id": customer.id,
            "customer_name": customer.name,
            "amount": float(payment.amount),
            "due_date": payment.due_date.isoformat() if payment.due_date else None,
        }
        for payment, order, customer in rows
    ]


def best_sellers(db: Session, limit: int = 5) -> list[dict]:
    """Top products by total quantity sold, across all order_items."""
    rows = (
        db.query(
            Product.id,
            Product.name,
            func.sum(OrderItem.quantity).label("total_quantity"),
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "product_id": product_id,
            "product_name": name,
            "total_quantity_sold": int(total_quantity),
        }
        for product_id, name, total_quantity in rows
    ]
    
    
def add_note(db: Session, customer_id: int, content: str) -> dict:
    """Writes a note tied to a customer, then logs the action."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        return {"success": False, "error": f"No customer found with id {customer_id}"}

    note = Note(customer_id=customer_id, content=content)
    db.add(note)
    db.flush()  # get note.id before logging

    db.add(ActivityLog(
        action_type="note_added",
        description=f"Note added for {customer.name}: {content}",
        related_customer_id=customer_id,
    ))
    db.commit()

    return {
        "success": True,
        "note_id": note.id,
        "customer_id": customer_id,
        "customer_name": customer.name,
        "content": note.content,
    }


def send_payment_reminder(db: Session, payment_id: int) -> dict:
    """Records a simulated payment reminder — never sends a real message (ADR-006)."""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return {"success": False, "error": f"No payment found with id {payment_id}"}

    if payment.status not in ("overdue", "pending"):
        return {
            "success": False,
            "error": (
                f"Payment {payment_id} has status '{payment.status}' — "
                "reminders only apply to overdue or pending payments"
            ),
        }

    order = db.query(Order).filter(Order.id == payment.order_id).first()
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()

    payment.reminder_sent_at = datetime.now(timezone.utc)

    db.add(ActivityLog(
        action_type="payment_reminder",
        description=(
            f"Simulated payment reminder recorded for {customer.name} — "
            f"${float(payment.amount):.2f} (payment_id={payment.id})"
        ),
        related_customer_id=customer.id,
    ))
    db.commit()

    return {
        "success": True,
        "payment_id": payment.id,
        "customer_id": customer.id,
        "customer_name": customer.name,
        "amount": float(payment.amount),
        "status": payment.status,
        "reminder_sent_at": payment.reminder_sent_at.isoformat(),
        "note": "Simulated reminder recorded in the system. No real message was sent.",
    }
    
    
def recent_activity(db: Session, limit: int = 20) -> list[dict]:
    """Most recent audit-log entries, for the dashboard's activity feed."""
    rows = (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": row.id,
            "action_type": row.action_type,
            "description": row.description,
            "related_customer_id": row.related_customer_id,
            "created_at": row.created_at.isoformat(),
        }
        for row in rows
    ]