from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import Ticket, Note
from ..schemas import (
    TicketCreate,
    TicketUpdate,
)


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"]
)


# ==========================================
# ALLOWED STATUS VALUES
# ==========================================

ALLOWED_STATUSES = [
    "Open",
    "In Progress",
    "Closed"
]


# ==========================================
# ALLOWED PRIORITY VALUES
# ==========================================

ALLOWED_PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Urgent"
]


# ==========================================
# HELPER: GENERATE TICKET ID
# ==========================================

def generate_ticket_id(db: Session):

    last_ticket = (
        db.query(Ticket)
        .order_by(Ticket.id.desc())
        .first()
    )

    # First ticket
    if last_ticket is None:
        return "TKT-001"

    # Get number from existing ticket ID
    last_number = int(
        last_ticket.ticket_id.split("-")[1]
    )

    new_number = last_number + 1

    return f"TKT-{new_number:03d}"


# ==========================================
# 1. CREATE TICKET
#
# POST /api/tickets/
# ==========================================

@router.post("/")
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db)
):

    # Generate ticket ID
    ticket_id = generate_ticket_id(db)


    # Create new ticket
    new_ticket = Ticket(

        ticket_id=ticket_id,

        customer_name=
            ticket_data.customer_name,

        customer_email=
            ticket_data.customer_email,

        subject=
            ticket_data.subject,

        description=
            ticket_data.description,

        # New tickets start as Open
        status="Open",

        # Agent-only priority
        # Every new ticket starts as Medium
        priority="Medium"
    )


    # Save ticket
    db.add(new_ticket)

    db.commit()

    db.refresh(new_ticket)


    # Return confirmation
    return {

        "ticket_id":
            new_ticket.ticket_id,

        "created_at":
            new_ticket.created_at

    }


# ==========================================
# 2. LIST / SEARCH / FILTER TICKETS
#
# GET /api/tickets/
#
# Used by Agent Dashboard
# ==========================================

@router.get("/")
def get_tickets(

    status: Optional[str] =
        Query(default=None),

    search: Optional[str] =
        Query(default=None),

    priority: Optional[str] =
        Query(default=None),

    db: Session =
        Depends(get_db)
):

    # Start query
    query = db.query(Ticket)


    # ======================================
    # STATUS FILTER
    # ======================================

    if status:

        if status not in ALLOWED_STATUSES:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid Status. "
                    "Use Open, In Progress, "
                    "or Closed."
                )
            )


        query = query.filter(
            Ticket.status == status
        )


    # ======================================
    # PRIORITY FILTER
    # Agent only
    # ======================================

    if priority:

        if priority not in ALLOWED_PRIORITIES:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid Priority. "
                    "Use Low, Medium, "
                    "High, or Urgent."
                )
            )


        query = query.filter(
            Ticket.priority == priority
        )


    # ======================================
    # SEARCH
    # ======================================

    if search:

        search_term = f"%{search}%"


        query = query.filter(

            (
                Ticket.ticket_id.ilike(
                    search_term
                )
            )

            |

            (
                Ticket.customer_name.ilike(
                    search_term
                )
            )

            |

            (
                Ticket.customer_email.ilike(
                    search_term
                )
            )

            |

            (
                Ticket.subject.ilike(
                    search_term
                )
            )

            |

            (
                Ticket.description.ilike(
                    search_term
                )
            )

        )


    # ======================================
    # GET RESULTS
    # ======================================

    tickets = (
        query
        .order_by(
            Ticket.created_at.desc()
        )
        .all()
    )


    # ======================================
    # AGENT RESPONSE
    #
    # Priority is included here because
    # this endpoint is used by the agent.
    # ======================================

    return [

        {

            "ticket_id":
                ticket.ticket_id,

            "customer_name":
                ticket.customer_name,

            "customer_email":
                ticket.customer_email,

            "subject":
                ticket.subject,

            "description":
                ticket.description,

            "status":
                ticket.status,

            "priority":
                ticket.priority,

            "created_at":
                ticket.created_at

        }

        for ticket in tickets

    ]


# ==========================================
# 3. GET SINGLE TICKET - AGENT
#
# GET /api/tickets/agent/{ticket_id}
#
# Agent receives priority.
# ==========================================

@router.get("/agent/{ticket_id}")
def get_agent_ticket(

    ticket_id: str,

    db: Session =
        Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.ticket_id == ticket_id
        )
        .first()
    )


    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket Not Found"
        )


    return {

        "ticket_id":
            ticket.ticket_id,

        "customer_name":
            ticket.customer_name,

        "customer_email":
            ticket.customer_email,

        "subject":
            ticket.subject,

        "description":
            ticket.description,

        "status":
            ticket.status,

        # ==================================
        # AGENT ONLY
        # ==================================

        "priority":
            ticket.priority,

        "created_at":
            ticket.created_at,

        "updated_at":
            ticket.updated_at,

        "notes": [

            {

                "id":
                    note.id,

                "ticket_id":
                    note.ticket_id,

                "note_text":
                    note.note_text,

                "created_at":
                    note.created_at

            }

            for note in ticket.notes

        ]

    }


# ==========================================
# 4. GET SINGLE TICKET - CUSTOMER
#
# GET /api/tickets/{ticket_id}
#
# IMPORTANT:
# Priority is NOT returned here.
# ==========================================

@router.get("/{ticket_id}")
def get_ticket(

    ticket_id: str,

    db: Session =
        Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.ticket_id == ticket_id
        )
        .first()
    )


    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket Not Found"
        )


    return {

        "ticket_id":
            ticket.ticket_id,

        "customer_name":
            ticket.customer_name,

        "customer_email":
            ticket.customer_email,

        "subject":
            ticket.subject,

        "description":
            ticket.description,

        "status":
            ticket.status,

        "created_at":
            ticket.created_at,

        "updated_at":
            ticket.updated_at,

        # ==================================
        # NOTES
        # ==================================

        "notes": [

            {

                "id":
                    note.id,

                "ticket_id":
                    note.ticket_id,

                "note_text":
                    note.note_text,

                "created_at":
                    note.created_at

            }

            for note in ticket.notes

        ]

    }


# ==========================================
# 5. UPDATE TICKET
#
# PUT /api/tickets/{ticket_id}
#
# Agent actions:
# - Status
# - Priority
# - Notes
# ==========================================

@router.put("/{ticket_id}")
def update_ticket(

    ticket_id: str,

    update_data: TicketUpdate,

    db: Session =
        Depends(get_db)
):

    # ======================================
    # FIND TICKET
    # ======================================

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.ticket_id == ticket_id
        )
        .first()
    )


    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket Not Found"
        )


    # ======================================
    # UPDATE STATUS
    # ======================================

    if update_data.status is not None:

        if (
            update_data.status
            not in ALLOWED_STATUSES
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid Status. "
                    "Use Open, In Progress, "
                    "or Closed."
                )
            )


        ticket.status = update_data.status


    # ======================================
    # UPDATE PRIORITY
    # Agent only
    # ======================================

    if update_data.priority is not None:

        if (
            update_data.priority
            not in ALLOWED_PRIORITIES
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid Priority. "
                    "Use Low, Medium, "
                    "High, or Urgent."
                )
            )


        ticket.priority = update_data.priority


    # ======================================
    # ADD NOTE
    # ======================================

    if update_data.notes is not None:

        note_text = update_data.notes.strip()


        # Only add non-empty notes
        if note_text:

            new_note = Note(

                ticket_id=
                    ticket.ticket_id,

                note_text=
                    note_text

            )


            db.add(new_note)


    # ======================================
    # SAVE CHANGES
    # ======================================

    db.commit()

    db.refresh(ticket)


    # ======================================
    # RESPONSE
    # ======================================

    return {

        "success": True,

        "ticket_id":
            ticket.ticket_id,

        "status":
            ticket.status,

        "priority":
            ticket.priority,

        "updated_at":
            ticket.updated_at

    }