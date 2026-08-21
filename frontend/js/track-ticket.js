// ==========================================
// SUPPORT CRM - TRACK TICKET
// ==========================================

console.log(
    "track-ticket.js loaded"
);


// ==========================================
// API
// ==========================================

const API_URL =
    "https://datastraw-support-crm-production-6bd5.up.railway.app";


// ==========================================
// ELEMENTS
// ==========================================

const form =
    document.getElementById(
        "trackTicketForm"
    );


const ticketIdInput =
    document.getElementById(
        "ticketIdInput"
    );


const trackButton =
    document.getElementById(
        "trackTicketButton"
    );


const errorBox =
    document.getElementById(
        "trackError"
    );


const errorMessage =
    document.getElementById(
        "trackErrorMessage"
    );


const ticketResult =
    document.getElementById(
        "ticketResult"
    );


// ==========================================
// RESULT ELEMENTS
// ==========================================

const resultTicketId =
    document.getElementById(
        "resultTicketId"
    );


const resultStatus =
    document.getElementById(
        "resultStatus"
    );


const resultSubject =
    document.getElementById(
        "resultSubject"
    );


const resultDate =
    document.getElementById(
        "resultDate"
    );


const resultDescription =
    document.getElementById(
        "resultDescription"
    );


const resultCustomerName =
    document.getElementById(
        "resultCustomerName"
    );


const resultCustomerEmail =
    document.getElementById(
        "resultCustomerEmail"
    );


const resultNotes =
    document.getElementById(
        "resultNotes"
    );


// ==========================================
// FORM SUBMIT
// ==========================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // ==================================
        // GET TICKET ID
        // ==================================

        const ticketId =
            ticketIdInput.value
                .trim()
                .toUpperCase();


        // ==================================
        // VALIDATION
        // ==================================

        if (!ticketId) {

            showError(
                "Please enter a Ticket ID."
            );

            return;

        }


        // ==================================
        // HIDE OLD RESULT
        // ==================================

        errorBox.classList.add(
            "hidden"
        );

        ticketResult.classList.add(
            "hidden"
        );


        // ==================================
        // DISABLE BUTTON
        // ==================================

        trackButton.disabled =
            true;

        trackButton.textContent =
            "Searching...";


        try {

            console.log(
                `Searching for ticket: ${ticketId}`
            );


            // ==================================
            // GET TICKET
            // ==================================

            const response =
                await fetch(
                    `${API_URL}/api/tickets/${encodeURIComponent(ticketId)}`
                );


            console.log(
                "FastAPI status:",
                response.status
            );


            // ==================================
            // READ RESPONSE
            // ==================================

            const data =
                await response.json();


            console.log(
                "Ticket response:",
                data
            );


            // ==================================
            // HANDLE ERROR
            // ==================================

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Ticket not found."
                );

            }


            // ==================================
            // DISPLAY TICKET
            // ==================================

            displayTicket(
                data
            );


        }


        catch (error) {

            console.error(
                "Track ticket error:",
                error
            );


            showError(
                error.message ||
                "Unable to find ticket."
            );

        }


        finally {

            trackButton.disabled =
                false;

            trackButton.textContent =
                "Track Ticket";

        }

    }
);


// ==========================================
// DISPLAY TICKET
// ==========================================

function displayTicket(ticket) {

    // ======================================
    // BASIC INFORMATION
    // ======================================

    resultTicketId.textContent =
        ticket.ticket_id;


    resultSubject.textContent =
        ticket.subject;


    resultDescription.textContent =
        ticket.description;


    resultDate.textContent =
        formatDate(
            ticket.created_at
        );


    // ======================================
    // CUSTOMER
    // ======================================

    resultCustomerName.textContent =
        ticket.customer_name;


    resultCustomerEmail.textContent =
        ticket.customer_email;


    // ======================================
    // STATUS
    // ======================================

    updateStatus(
        ticket.status
    );


    // ======================================
    // NOTES
    // ======================================

    renderNotes(
        ticket.notes
    );


    // ======================================
    // SHOW RESULT
    // ======================================

    ticketResult.classList.remove(
        "hidden"
    );


    // ======================================
    // SCROLL TO RESULT
    // ======================================

    setTimeout(() => {

        ticketResult.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }, 100);

}


// ==========================================
// STATUS
// ==========================================

function updateStatus(status) {

    resultStatus.textContent =
        status;


    resultStatus.classList.remove(

        "bg-emerald-100",
        "text-emerald-700",

        "bg-amber-100",
        "text-amber-700",

        "bg-slate-100",
        "text-slate-700"

    );


    if (status === "Open") {

        resultStatus.classList.add(
            "bg-emerald-100",
            "text-emerald-700"
        );

    }

    else if (
        status === "In Progress"
    ) {

        resultStatus.classList.add(
            "bg-amber-100",
            "text-amber-700"
        );

    }

    else if (
        status === "Closed"
    ) {

        resultStatus.classList.add(
            "bg-slate-100",
            "text-slate-700"
        );

    }

    else {

        resultStatus.classList.add(
            "bg-slate-100",
            "text-slate-700"
        );

    }

}


// ==========================================
// RENDER NOTES
// ==========================================

function renderNotes(notes) {

    resultNotes.innerHTML =
        "";


    // ======================================
    // NO NOTES
    // ======================================

    if (
        !notes ||
        notes.length === 0
    ) {

        resultNotes.innerHTML = `

            <p
                class="text-sm
                       text-slate-500">

                No updates yet.

            </p>

        `;

        return;

    }


    // ======================================
    // NOTES
    // ======================================

    notes.forEach(
        (note) => {

            const noteElement =
                document.createElement(
                    "div"
                );


            noteElement.className = `
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                p-4
                mb-3
            `;


            noteElement.innerHTML = `

                <p
                    class="text-slate-700
                           leading-relaxed">

                    ${escapeHtml(
                        note.note_text
                    )}

                </p>


                <p
                    class="text-xs
                           text-slate-400
                           mt-2">

                    ${formatDate(
                        note.created_at
                    )}

                </p>

            `;


            resultNotes.appendChild(
                noteElement
            );

        }
    );

}


// ==========================================
// ERROR
// ==========================================

function showError(message) {

    errorMessage.textContent =
        message;


    errorBox.classList.remove(
        "hidden"
    );

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(dateString);


    return date.toLocaleString();

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}