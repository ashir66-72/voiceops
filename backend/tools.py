from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.models import Customer, Order, OrderItem, Payment, Product


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