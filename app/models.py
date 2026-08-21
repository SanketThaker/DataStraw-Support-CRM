from datetime import datetime, timezone, timedelta

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from .database import Base


# ==========================================
# INDIA STANDARD TIME (IST)
# UTC +05:30
# ==========================================

IST = timezone(
    timedelta(hours=5, minutes=30)
)


def get_ist_time():
    """
    Return the current time in India Standard Time.

    tzinfo is removed because the existing
    database columns use SQLAlchemy DateTime
    without timezone=True.
    """

    return datetime.now(IST).replace(
        tzinfo=None
    )


# ==========================================
# TICKET MODEL
# ==========================================

class Ticket(Base):

    __tablename__ = "tickets"


    # ======================================
    # PRIMARY KEY
    # ======================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # ======================================
    # TICKET ID
    # Example: TKT-001
    # ======================================

    ticket_id = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )


    # ======================================
    # CUSTOMER INFORMATION
    # ======================================

    customer_name = Column(
        String,
        nullable=False
    )


    customer_email = Column(
        String,
        nullable=False
    )


    # ======================================
    # TICKET INFORMATION
    # ======================================

    subject = Column(
        String,
        nullable=False
    )


    description = Column(
        Text,
        nullable=False
    )


    # ======================================
    # STATUS
    # ======================================

    status = Column(
        String,
        default="Open",
        nullable=False
    )


    # ======================================
    # PRIORITY
    # AGENT ONLY
    # ======================================

    priority = Column(
        String,
        default="Medium",
        nullable=False
    )


    # ======================================
    # TIMESTAMPS
    # ======================================

    created_at = Column(
        DateTime,
        default=get_ist_time
    )


    updated_at = Column(
        DateTime,
        default=get_ist_time,
        onupdate=get_ist_time
    )


    # ======================================
    # NOTES RELATIONSHIP
    # ======================================

    notes = relationship(
        "Note",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )


# ==========================================
# NOTE MODEL
# ==========================================

class Note(Base):

    __tablename__ = "notes"


    # ======================================
    # PRIMARY KEY
    # ======================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # ======================================
    # TICKET RELATIONSHIP
    # ======================================

    ticket_id = Column(
        String,
        ForeignKey(
            "tickets.ticket_id"
        ),
        nullable=False
    )


    # ======================================
    # NOTE CONTENT
    # ======================================

    note_text = Column(
        Text,
        nullable=False
    )


    # ======================================
    # NOTE TIMESTAMP
    # ======================================

    created_at = Column(
        DateTime,
        default=get_ist_time
    )


    # ======================================
    # RELATIONSHIP BACK TO TICKET
    # ======================================

    ticket = relationship(
        "Ticket",
        back_populates="notes"
    )