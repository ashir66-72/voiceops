"""
Urban Bites — deterministic seed data for VoiceOps.

Rerunning this script is safe: it truncates all seven tables first,
so you always end up with the same fixed dataset — same customers,
same orders, same overdue/pending payments — every time.
"""

from datetime import datetime, timedelta
from decimal import Decimal

from sqlalchemy import text

from backend.database import engine, SessionLocal
from backend.models import Customer, Product, Order, OrderItem, Payment

# Anchor date for all relative math (order dates, due dates).
# Fixed, not datetime.now(), so "overdue" vs "pending" never drifts
# depending on what day you happen to run this.
TODAY = datetime(2026, 9, 11)


def reset_tables():
    with engine.begin() as conn:
        conn.execute(text("""
            TRUNCATE TABLE
                activity_log, notes, payments, order_items,
                orders, products, customers
            RESTART IDENTITY CASCADE
        """))


CUSTOMERS = [
    ("Ahmed Khan",      "0301-1234567", "ahmed.khan@example.com"),
    ("Sara Malik",      "0302-2345678", "sara.malik@example.com"),
    ("Bilal Ahmed",     "0303-3456789", "bilal.ahmed@example.com"),
    ("Ayesha Siddiqui", "0304-4567890", "ayesha.siddiqui@example.com"),
    ("Usman Tariq",     "0305-5678901", "usman.tariq@example.com"),
    ("Hina Riaz",       "0306-6789012", "hina.riaz@example.com"),
    ("Farhan Iqbal",    "0307-7890123", "farhan.iqbal@example.com"),
    ("Zainab Hussain",  "0308-8901234", "zainab.hussain@example.com"),
    ("Omar Farooq",     "0309-9012345", "omar.farooq@example.com"),
    ("Mehwish Anwar",   "0300-0123456", "mehwish.anwar@example.com"),
]

PRODUCTS = [
    ("Chicken Biryani",      Decimal("8.50"), "Main"),
    ("Beef Burger",          Decimal("6.75"), "Main"),
    ("Grilled Chicken Wrap", Decimal("5.50"), "Main"),
    ("Margherita Pizza",     Decimal("9.25"), "Main"),
    ("Caesar Salad",         Decimal("4.75"), "Side"),
    ("Chocolate Brownie",    Decimal("3.25"), "Dessert"),
]

# (product_index, quantity) patterns, 0-indexed into PRODUCTS.
# Biryani (index 0) shows up in 4 of 6 patterns — deliberate best seller.
ITEM_PATTERNS = [
    [(0, 2), (4, 1)],   # 2x Biryani + Salad
    [(0, 1), (5, 1)],   # Biryani + Brownie
    [(1, 1), (3, 1)],   # Burger + Pizza
    [(0, 3)],           # 3x Biryani
    [(2, 1), (4, 1)],   # Wrap + Salad
    [(0, 1), (1, 1)],   # Biryani + Burger
]


def seed():
    reset_tables()
    db = SessionLocal()

    try:
        customer_rows = [
            Customer(name=name, phone=phone, email=email)
            for name, phone, email in CUSTOMERS
        ]
        db.add_all(customer_rows)
        db.flush()  # populates .id on each row

        product_rows = [
            Product(name=name, price=price, category=category)
            for name, price, category in PRODUCTS
        ]
        db.add_all(product_rows)
        db.flush()

        orders = []
        for i in range(1, 31):
            customer = customer_rows[(i - 1) % 10]
            pattern = ITEM_PATTERNS[(i - 1) % 6]
            order_date = TODAY - timedelta(days=(35 - i))

            total = sum(PRODUCTS[p_idx][1] * qty for p_idx, qty in pattern)

            order = Order(
                customer_id=customer.id,
                order_date=order_date,
                total_amount=total,
                status="completed",
            )
            db.add(order)
            db.flush()  # need order.id before adding its items

            for p_idx, qty in pattern:
                db.add(OrderItem(
                    order_id=order.id,
                    product_id=product_rows[p_idx].id,
                    quantity=qty,
                    unit_price=PRODUCTS[p_idx][1],
                ))

            orders.append(order)

        db.flush()

        # Payments — one per order:
        #   1-20  -> paid
        #   21-26 -> overdue (due date in the past, unpaid)
        #   27-30 -> pending (due date in the future, unpaid)
        overdue_days_ago = [3, 5, 7, 10, 12, 15]
        pending_days_ahead = [2, 4, 6, 8]

        for idx, order in enumerate(orders, start=1):
            if idx <= 20:
                due_date = order.order_date + timedelta(days=7)
                db.add(Payment(
                    order_id=order.id,
                    amount=order.total_amount,
                    due_date=due_date,
                    paid_date=due_date - timedelta(days=2),
                    status="paid",
                ))
            elif idx <= 26:
                due_date = TODAY - timedelta(days=overdue_days_ago[idx - 21])
                db.add(Payment(
                    order_id=order.id,
                    amount=order.total_amount,
                    due_date=due_date,
                    paid_date=None,
                    status="overdue",
                ))
            else:
                due_date = TODAY + timedelta(days=pending_days_ahead[idx - 27])
                db.add(Payment(
                    order_id=order.id,
                    amount=order.total_amount,
                    due_date=due_date,
                    paid_date=None,
                    status="pending",
                ))

        db.commit()
        print("Seed complete: 10 customers, 6 products, 30 orders, "
              "55 order_items, 30 payments (20 paid / 6 overdue / 4 pending).")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()