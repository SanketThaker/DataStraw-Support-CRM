// ==========================================
// SUPPORT CRM - CREATE TICKET
// ==========================================

console.log("create-ticket.js loaded");


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
        "createTicketForm"
    );


const submitButton =
    document.getElementById(
        "submitButton"
    );


const successBox =
    document.getElementById(
        "ticketSuccess"
    );


const createdTicketId =
    document.getElementById(
        "createdTicketId"
    );


const createAnotherButton =
    document.getElementById(
        "createAnotherButton"
    );


const errorBox =
    document.getElementById(
        "ticketError"
    );


const errorMessage =
    document.getElementById(
        "ticketErrorMessage"
    );


// ==========================================
// FORM SUBMIT
// ==========================================

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            console.log(
                "Create ticket form submitted."
            );


            // ==================================
            // HIDE OLD MESSAGES
            // ==================================

            successBox.classList.add(
                "hidden"
            );

            errorBox.classList.add(
                "hidden"
            );


            // ==================================
            // GET FORM VALUES
            // ==================================

            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const customerEmail =
                document
                    .getElementById(
                        "customerEmail"
                    )
                    .value
                    .trim();


            const subject =
                document
                    .getElementById(
                        "subject"
                    )
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "description"
                    )
                    .value
                    .trim();


            // ==================================
            // VALIDATION
            // ==================================

            if (
                !customerName ||
                !customerEmail ||
                !subject ||
                !description
            ) {

                showError(
                    "Please fill in all fields."
                );

                return;

            }


            // ==================================
            // DISABLE BUTTON
            // ==================================

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Creating Ticket...";


            try {

                console.log(
                    "Sending request to FastAPI..."
                );


                // ==================================
                // SEND REQUEST
                // ==================================

                const response =
                    await fetch(
                        `${API_URL}/api/tickets/`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    customer_name:
                                        customerName,

                                    customer_email:
                                        customerEmail,

                                    subject:
                                        subject,

                                    description:
                                        description

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

                const data =
                    await response.json();


                console.log(
                    "FastAPI response:",
                    data
                );


                // ==================================
                // HANDLE ERROR
                // ==================================

                if (!response.ok) {

                    let message =
                        "Failed to create ticket.";


                    if (
                        data &&
                        data.detail
                    ) {

                        message =
                            Array.isArray(
                                data.detail
                            )

                                ? data.detail
                                    .map(
                                        error =>
                                            error.msg
                                    )
                                    .join(", ")

                                : data.detail;

                    }


                    throw new Error(
                        message
                    );

                }


                // ==================================
                // CHECK TICKET ID
                // ==================================

                if (
                    !data.ticket_id
                ) {

                    throw new Error(
                        "Ticket created, but no Ticket ID was returned."
                    );

                }


                console.log(
                    "Ticket ID:",
                    data.ticket_id
                );


                // ==================================
                // SHOW TICKET ID
                // ==================================

                createdTicketId.textContent =
                    data.ticket_id;


                // ==================================
                // HIDE FORM
                // ==================================

                form.classList.add(
                    "hidden"
                );


                // ==================================
                // SHOW CONFIRMATION
                // ==================================

                successBox.classList.remove(
                    "hidden"
                );


                console.log(
                    "Confirmation displayed."
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

                // ==================================
                // ENABLE BUTTON
                // ==================================

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Create Ticket";

            }

        }
    );

}


// ==========================================
// CREATE ANOTHER TICKET
// ==========================================

if (createAnotherButton) {

    createAnotherButton.addEventListener(
        "click",
        () => {

            console.log(
                "Creating another ticket."
            );


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


            // Reset form

            form.reset();


            // Clear Ticket ID

            createdTicketId.textContent =
                "";


            // Focus first field

            document
                .getElementById(
                    "customerName"
                )
                .focus();

        }
    );

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    errorMessage.textContent =
        message;


    errorBox.classList.remove(
        "hidden"
    );

}