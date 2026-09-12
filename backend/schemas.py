from pydantic import BaseModel, Field


class AddNoteRequest(BaseModel):
    customer_id: int
    content: str = Field(..., min_length=1)


class SendPaymentReminderRequest(BaseModel):
    payment_id: int