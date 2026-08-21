// ==========================================
// SUPPORT CRM - TICKET DETAILS
// ==========================================

console.log("tickets.js loaded");


// ==========================================
// API
// ==========================================

const API_URL =
    "https://datastraw-support-crm-production-6bd5.up.railway.app";


// ==========================================
// GET TICKET ID FROM URL
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const ticketId =
    params.get("id");


console.log(
    "Ticket ID:",
    ticketId
);


// ==========================================
// HTML ELEMENTS
// ==========================================

const ticketIdElement =
    document.getElementById(
        "ticketId"
    );


const ticketStatus =
    document.getElementById(
        "ticketStatus"
    );


const ticketPriority =
    document.getElementById(
        "ticketPriority"
    );


const ticketSubject =
    document.getElementById(
        "ticketSubject"
    );


const ticketDate =
    document.getElementById(
        "ticketDate"
    );


const ticketDescription =
    document.getElementById(
        "ticketDescription"
    );


const customerName =
    document.getElementById(
        "customerName"
    );


const customerEmail =
    document.getElementById(
        "customerEmail"
    );


const notesList =
    document.getElementById(
        "notesList"
    );


// ==========================================
// AGENT ACTIONS
// ==========================================

const statusSelect =
    document.getElementById(
        "statusSelect"
    );


const prioritySelect =
    document.getElementById(
        "prioritySelect"
    );


const saveChangesButton =
    document.getElementById(
        "saveChangesButton"
    );


const noteInput =
    document.getElementById(
        "noteInput"
    );


const addNoteButton =
    document.getElementById(
        "addNoteButton"
    );


// ==========================================
// LOAD TICKET
// ==========================================

async function loadTicket() {

    if (!ticketId) {

        console.error(
            "No ticket ID found."
        );

        if (ticketSubject) {

            ticketSubject.textContent =
                "Ticket ID missing";

        }

        return;

    }


    try {

        console.log(
            `Fetching agent ticket: ${ticketId}`
        );


        // IMPORTANT:
        // Use the AGENT endpoint because
        // it includes priority.

        const response =
            await fetch(
                `${API_URL}/api/tickets/agent/${ticketId}`,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        console.log(
            "Ticket response:",
            response.status
        );


        if (!response.ok) {

            let errorMessage =
                `Server returned ${response.status}`;


            try {

                const errorData =
                    await response.json();


                if (errorData.detail) {

                    errorMessage =
                        errorData.detail;

                }

            }

            catch {

                // Keep default error

            }


            throw new Error(
                errorMessage
            );

        }


        const ticket =
            await response.json();


        console.log(
            "Agent ticket loaded:",
            ticket
        );


        // ==================================
        // BASIC INFORMATION
        // ==================================

        if (ticketIdElement) {

            ticketIdElement.textContent =
                ticket.ticket_id;

        }


        if (ticketSubject) {

            ticketSubject.textContent =
                ticket.subject;

        }


        if (ticketDescription) {

            ticketDescription.textContent =
                ticket.description;

        }


        if (ticketDate) {

            ticketDate.textContent =
                formatDate(
                    ticket.created_at
                );

        }


        // ==================================
        // CUSTOMER
        // ==================================

        if (customerName) {

            customerName.textContent =
                ticket.customer_name;

        }


        if (customerEmail) {

            customerEmail.textContent =
                ticket.customer_email;

        }


        // ==================================
        // STATUS
        // ==================================

        updateStatusDisplay(
            ticket.status
        );


        if (statusSelect) {

            statusSelect.value =
                ticket.status;

        }


        // ==================================
        // PRIORITY
        // ==================================

        const currentPriority =
            ticket.priority || "Medium";


        if (prioritySelect) {

            prioritySelect.value =
                currentPriority;

        }


        updatePriorityDisplay(
            currentPriority
        );


        // ==================================
        // NOTES
        // ==================================

        renderNotes(
            ticket.notes
        );

    }


    catch (error) {

        console.error(
            "Failed to load ticket:",
            error
        );


        if (ticketSubject) {

            ticketSubject.textContent =
                "Unable to load ticket";

        }


        if (ticketDescription) {

            ticketDescription.textContent =
                error.message ||
                "Could not connect to the Support CRM server.";

        }

    }

}


// ==========================================
// STATUS DISPLAY
// ==========================================

function updateStatusDisplay(status) {

    if (!ticketStatus) {

        return;

    }


    ticketStatus.textContent =
        status;


    ticketStatus.classList.remove(

        "bg-emerald-100",
        "text-emerald-700",

        "bg-amber-100",
        "text-amber-700",

        "bg-slate-100",
        "text-slate-700"

    );


    if (status === "Open") {

        ticketStatus.classList.add(
            "bg-emerald-100",
            "text-emerald-700"
        );

    }

    else if (
        status === "In Progress"
    ) {

        ticketStatus.classList.add(
            "bg-amber-100",
            "text-amber-700"
        );

    }

    else if (
        status === "Closed"
    ) {

        ticketStatus.classList.add(
            "bg-slate-100",
            "text-slate-700"
        );

    }

}


// ==========================================
// PRIORITY DISPLAY
// ==========================================

function updatePriorityDisplay(priority) {

    if (!ticketPriority) {

        return;

    }


    ticketPriority.classList.remove(

        "bg-emerald-100",
        "text-emerald-700",

        "bg-amber-100",
        "text-amber-700",

        "bg-orange-100",
        "text-orange-700",

        "bg-red-100",
        "text-red-700"

    );


    if (priority === "Low") {

        ticketPriority.textContent =
            "🟢 Low";


        ticketPriority.classList.add(
            "bg-emerald-100",
            "text-emerald-700"
        );

    }

    else if (
        priority === "Medium"
    ) {

        ticketPriority.textContent =
            "🟡 Medium";


        ticketPriority.classList.add(
            "bg-amber-100",
            "text-amber-700"
        );

    }

    else if (
        priority === "High"
    ) {

        ticketPriority.textContent =
            "🟠 High";


        ticketPriority.classList.add(
            "bg-orange-100",
            "text-orange-700"
        );

    }

    else if (
        priority === "Urgent"
    ) {

        ticketPriority.textContent =
            "🔴 Urgent";


        ticketPriority.classList.add(
            "bg-red-100",
            "text-red-700"
        );

    }

}


// ==========================================
// SAVE STATUS + PRIORITY
// ==========================================

async function saveChanges() {

    if (!ticketId) {

        alert(
            "Ticket ID is missing."
        );

        return;

    }


    const newStatus =
        statusSelect.value;


    const newPriority =
        prioritySelect.value;


    console.log(
        "Saving changes:",
        {
            status: newStatus,
            priority: newPriority
        }
    );


    // ======================================
    // DISABLE BUTTON
    // ======================================

    saveChangesButton.disabled =
        true;


    saveChangesButton.textContent =
        "Saving...";


    try {

        // ==================================
        // SEND BOTH VALUES
        // ==================================

        const response =
            await fetch(
                `${API_URL}/api/tickets/${ticketId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            status:
                                newStatus,

                            priority:
                                newPriority

                        })
                }
            );


        console.log(
            "Save response:",
            response.status
        );


        // ==================================
        // HANDLE ERROR
        // ==================================

        if (!response.ok) {

            let errorMessage =
                "Failed to save changes.";


            try {

                const errorData =
                    await response.json();


                if (errorData.detail) {

                    errorMessage =
                        Array.isArray(
                            errorData.detail
                        )

                            ? errorData.detail
                                .map(
                                    error =>
                                        error.msg
                                )
                                .join(", ")

                            : errorData.detail;

                }

            }

            catch {

                // Keep default error

            }


            throw new Error(
                errorMessage
            );

        }


        // ==================================
        // READ RESPONSE
        // ==================================

        const data =
            await response.json();


        console.log(
            "Changes saved successfully:",
            data
        );


        // ==================================
        // UPDATE UI IMMEDIATELY
        // ==================================

        updateStatusDisplay(
            data.status
        );


        updatePriorityDisplay(
            data.priority
        );


        statusSelect.value =
            data.status;


        prioritySelect.value =
            data.priority;


        // ==================================
        // SUCCESS BUTTON
        // ==================================

        saveChangesButton.textContent =
            "Saved ✓";


        // Give the agent a small visual
        // confirmation without reloading
        // the entire page.

        setTimeout(
            () => {

                saveChangesButton.textContent =
                    "Save Changes";

            },
            1500
        );

    }


    catch (error) {

        console.error(
            "Save changes error:",
            error
        );


        alert(
            error.message ||
            "Unable to save changes."
        );


        saveChangesButton.textContent =
            "Save Changes";

    }


    finally {

        saveChangesButton.disabled =
            false;

    }

}


// ==========================================
// ADD NOTE
// ==========================================

async function addNote() {

    console.log(
        "Add Note button clicked."
    );


    if (!ticketId) {

        alert(
            "Ticket ID is missing."
        );

        return;

    }


    const noteText =
        noteInput.value.trim();


    if (!noteText) {

        alert(
            "Please write a note first."
        );

        return;

    }


    // ======================================
    // DISABLE BUTTON
    // ======================================

    addNoteButton.disabled =
        true;


    addNoteButton.textContent =
        "Adding...";


    try {

        const response =
            await fetch(
                `${API_URL}/api/tickets/${ticketId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            notes:
                                noteText

                        })
                }
            );


        console.log(
            "Note response:",
            response.status
        );


        if (!response.ok) {

            let errorMessage =
                "Failed to add note.";


            try {

                const errorData =
                    await response.json();


                if (errorData.detail) {

                    errorMessage =
                        Array.isArray(
                            errorData.detail
                        )

                            ? errorData.detail
                                .map(
                                    error =>
                                        error.msg
                                )
                                .join(", ")

                            : errorData.detail;

                }

            }

            catch {

                // Keep default error

            }


            throw new Error(
                errorMessage
            );

        }


        const data =
            await response.json();


        console.log(
            "Note added successfully:",
            data
        );


        // Clear textarea

        noteInput.value =
            "";


        // Reload ticket so the
        // new note appears.

        await loadTicket();

    }


    catch (error) {

        console.error(
            "Add note error:",
            error
        );


        alert(
            error.message ||
            "Unable to add note."
        );

    }


    finally {

        addNoteButton.disabled =
            false;


        addNoteButton.textContent =
            "Add Note";

    }

}


// ==========================================
// BUTTON EVENTS
// ==========================================

if (saveChangesButton) {

    saveChangesButton.addEventListener(
        "click",
        saveChanges
    );

}


if (addNoteButton) {

    addNoteButton.addEventListener(
        "click",
        addNote
    );

}


// ==========================================
// RENDER NOTES
// ==========================================

function renderNotes(notes) {

    if (!notesList) {

        return;

    }


    notesList.innerHTML =
        "";


    if (
        !notes ||
        notes.length === 0
    ) {

        notesList.innerHTML = `

            <p
                class="
                    text-sm
                    text-slate-500
                ">

                No notes yet.

            </p>

        `;

        return;

    }


    notes.forEach(
        note => {

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
                transition
                hover:shadow-sm
            `;


            noteElement.innerHTML = `

                <p
                    class="
                        text-slate-700
                    ">

                    ${escapeHtml(
                        note.note_text
                    )}

                </p>


                <p
                    class="
                        text-xs
                        text-slate-400
                        mt-2
                    ">

                    ${formatDate(
                        note.created_at
                    )}

                </p>

            `;


            notesList.appendChild(
                noteElement
            );

        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;

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


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// START
// ==========================================

loadTicket();