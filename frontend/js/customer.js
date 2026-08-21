// ==========================================
// SUPPORT CRM - CUSTOMER
// CREATE TICKET
// ==========================================

console.log("customer.js loaded");


// ==========================================
// API
// ==========================================

const API_URL = "https://datastraw-support-crm-production-6bd5.up.railway.app";


// ==========================================
// ELEMENTS
// ==========================================

const form = document.getElementById("customerTicketForm");

const submitButton =
    document.getElementById("customerSubmitButton");

const successBox =
    document.getElementById("ticketSuccess");

const createdTicketId =
    document.getElementById("createdTicketId");

const createAnotherButton =
    document.getElementById("createAnotherButton");

const errorBox =
    document.getElementById("ticketError");

const errorMessage =
    document.getElementById("ticketErrorMessage");


// ==========================================
// CHECK ELEMENTS
// ==========================================

console.log("FORM:", form);
console.log("SUCCESS BOX:", successBox);
console.log("TICKET ID ELEMENT:", createdTicketId);


// ==========================================
// SUBMIT FORM
// ==========================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    console.log("SUBMIT BUTTON CLICKED");


    // ======================================
    // GET VALUES
    // ======================================

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerEmail =
        document.getElementById("customerEmail").value.trim();

    const subject =
        document.getElementById("subject").value.trim();

    const description =
        document.getElementById("description").value.trim();


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !customerName ||
        !customerEmail ||
        !subject ||
        !description
    ) {

        showError("Please fill in all fields.");

        return;
    }


    // ======================================
    // BUTTON
    // ======================================

    submitButton.disabled = true;

    submitButton.textContent = "Creating Ticket...";


    try {

        console.log("Sending ticket to FastAPI...");


        // ==================================
        // POST REQUEST
        // ==================================

        const response = await fetch(
            `${API_URL}/api/tickets/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    customer_name: customerName,

                    customer_email: customerEmail,

                    subject: subject,

                    description: description

                })
            }
        );


        console.log(
            "FastAPI status:",
            response.status
        );


        // ==================================
        // READ RESPONSE
        // ==================================

        const data = await response.json();


        console.log(
            "FastAPI response:",
            data
        );


        // ==================================
        // API ERROR
        // ==================================

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to create ticket."
            );

        }


        // ==================================
        // CHECK TICKET ID
        // ==================================

        if (!data.ticket_id) {

            throw new Error(
                "Ticket was created but Ticket ID was not returned."
            );

        }


        console.log(
            "Ticket ID received:",
            data.ticket_id
        );


        // ==================================
        // PUT TICKET ID ON PAGE
        // ==================================

        createdTicketId.textContent =
            data.ticket_id;


        // ==================================
        // HIDE FORM
        // ==================================

        form.classList.add("hidden");


        // ==================================
        // SHOW CONFIRMATION
        // ==================================

        successBox.classList.remove("hidden");


        console.log(
            "CONFIRMATION DISPLAYED"
        );

    }


    catch (error) {

        console.error(
            "Create ticket error:",
            error
        );


        showError(
            error.message ||
            "Unable to create ticket."
        );

    }


    finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Submit Ticket";

    }

});


// ==========================================
// CREATE ANOTHER TICKET
// ==========================================

if (createAnotherButton) {

    createAnotherButton.addEventListener(
        "click",
        function () {

            // Hide confirmation

            successBox.classList.add(
                "hidden"
            );


            // Hide error

            errorBox.classList.add(
                "hidden"
            );


            // Show form

            form.classList.remove(
                "hidden"
            );


            // Clear form

            form.reset();


            // Focus name

            document
                .getElementById("customerName")
                .focus();

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