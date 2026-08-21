from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


# ==========================================
# CREATE TICKET
# ==========================================

class TicketCreate(BaseModel):

    customer_name: str

    customer_email: EmailStr

    subject: str

    description: str


# ==========================================
# UPDATE TICKET
# ==========================================

class TicketUpdate(BaseModel):

    status: Optional[str] = None

    notes: Optional[str] = None

    priority: Optional[str] = None


# ==========================================
# NOTE RESPONSE
# ==========================================

class NoteResponse(BaseModel):

    id: int

    ticket_id: str

    note_text: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# TICKET LIST RESPONSE
# ==========================================

class TicketListResponse(BaseModel):

    ticket_id: str

    customer_name: str

    subject: str

    status: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# COMPLETE TICKET RESPONSE
# CUSTOMER-SAFE RESPONSE
# ==========================================

class TicketResponse(BaseModel):

    ticket_id: str

    customer_name: str

    customer_email: str

    subject: str

    description: str

    status: str

    created_at: datetime

    updated_at: datetime

    notes: list[NoteResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )