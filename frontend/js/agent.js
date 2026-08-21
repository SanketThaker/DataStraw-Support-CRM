// ==========================================
// SUPPORT CRM - AGENT DASHBOARD
// ==========================================

console.log("agent.js loaded");


// ==========================================
// PREVENT DUPLICATE INITIALIZATION
// ==========================================

if (window.supportCRMInitialized) {

    console.warn(
        "agent.js already initialized."
    );

} else {

    window.supportCRMInitialized = true;


    // ======================================
    // ELEMENTS
    // ======================================

    const ticketList =
        document.getElementById("ticketList");

    const loadingState =
        document.getElementById("loadingState");

    const emptyState =
        document.getElementById("emptyState");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const priorityFilter =
        document.getElementById("priorityFilter");


    // ======================================
    // DATA
    // ======================================

    let tickets = [];


    // ======================================
    // CHECK REQUIRED ELEMENTS
    // ======================================

    console.log(
        "Agent dashboard elements:",
        {
            ticketList,
            loadingState,
            emptyState,
            searchInput,
            statusFilter,
            priorityFilter
        }
    );


    // ======================================
    // FORMAT DATE
    // ======================================

    function formatDate(dateString) {

        if (!dateString) {

            return "";

        }

        const date =
            new Date(dateString);

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    // ======================================
    // STATUS BADGE
    // ======================================

    function getStatusBadge(status) {

        if (status === "Open") {

            return `
                <span
                    class="
                        bg-emerald-100
                        text-emerald-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                    ">

                    Open

                </span>
            `;

        }


        if (status === "In Progress") {

            return `
                <span
                    class="
                        bg-amber-100
                        text-amber-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                    ">

                    In Progress

                </span>
            `;

        }


        if (status === "Closed") {

            return `
                <span
                    class="
                        bg-slate-100
                        text-slate-600
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                    ">

                    ✓ Closed

                </span>
            `;

        }


        return `
            <span
                class="
                    bg-slate-100
                    text-slate-600
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-medium
                ">

                ${status}

            </span>
        `;

    }


    // ======================================
    // PRIORITY BADGE
    // ======================================

    function getPriorityBadge(priority) {

        if (priority === "Low") {

            return `
                <span
                    class="
                        bg-emerald-50
                        text-emerald-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                    ">

                    🟢 Low

                </span>
            `;

        }


        if (priority === "Medium") {

            return `
                <span
                    class="
                        bg-amber-50
                        text-amber-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                    ">

                    🟡 Medium

                </span>
            `;

        }


        if (priority === "High") {

            return `
                <span
                    class="
                        bg-orange-50
                        text-orange-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                    ">

                    🟠 High

                </span>
            `;

        }


        if (priority === "Urgent") {

            return `
                <span
                    class="
                        bg-red-50
                        text-red-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                    ">

                    🔴 Urgent

                </span>
            `;

        }


        // Fallback

        return `
            <span
                class="
                    bg-amber-50
                    text-amber-700
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-medium
                ">

                🟡 Medium

            </span>
        `;

    }


    // ======================================
    // UPDATE STATISTICS
    // ======================================

    function updateStatistics(data) {

        const total =
            data.length;


        const open =
            data.filter(
                ticket =>
                    ticket.status === "Open"
            ).length;


        const progress =
            data.filter(
                ticket =>
                    ticket.status === "In Progress"
            ).length;


        const closed =
            data.filter(
                ticket =>
                    ticket.status === "Closed"
            ).length;


        const totalElement =
            document.getElementById(
                "totalTickets"
            );


        const openElement =
            document.getElementById(
                "openTickets"
            );


        const progressElement =
            document.getElementById(
                "progressTickets"
            );


        const closedElement =
            document.getElementById(
                "closedTickets"
            );


        if (totalElement) {

            totalElement.textContent =
                total;

        }


        if (openElement) {

            openElement.textContent =
                open;

        }


        if (progressElement) {

            progressElement.textContent =
                progress;

        }


        if (closedElement) {

            closedElement.textContent =
                closed;

        }

    }


    // ======================================
    // RENDER TICKETS
    // ======================================

    function renderTickets(data) {

        console.log(
            "Rendering tickets:",
            data
        );


        if (!ticketList) {

            console.error(
                "ticketList element not found."
            );

            return;

        }


        ticketList.innerHTML = "";


        if (loadingState) {

            loadingState.classList.add(
                "hidden"
            );

        }


        // ==================================
        // EMPTY
        // ==================================

        if (data.length === 0) {

            if (emptyState) {

                emptyState.classList.remove(
                    "hidden"
                );

            }

            return;

        }


        if (emptyState) {

            emptyState.classList.add(
                "hidden"
            );

        }


        // ==================================
        // CREATE CARDS
        // ==================================

        data.forEach(ticket => {

            const card =
                document.createElement(
                    "article"
                );


            card.className = `
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-5
                sm:p-6
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
                cursor-pointer
            `;


            card.innerHTML = `

                <!-- TOP -->

                <div
                    class="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                        gap-3
                    ">

                    <div>

                        <!-- ID + STATUS + PRIORITY -->

                        <div
                            class="
                                flex
                                items-center
                                flex-wrap
                                gap-2
                                mb-2
                            ">

                            <span
                                class="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                ">

                                ${ticket.ticket_id}

                            </span>


                            ${getStatusBadge(
                                ticket.status
                            )}


                            ${getPriorityBadge(
                                ticket.priority
                            )}

                        </div>


                        <!-- SUBJECT -->

                        <h4
                            class="
                                text-lg
                                font-semibold
                                text-slate-900
                            ">

                            ${ticket.subject}

                        </h4>

                    </div>


                    <!-- DATE -->

                    <span
                        class="
                            text-sm
                            text-slate-400
                            whitespace-nowrap
                        ">

                        ${formatDate(
                            ticket.created_at
                        )}

                    </span>

                </div>


                <!-- DESCRIPTION -->

                <p
                    class="
                        mt-4
                        text-sm
                        text-slate-500
                        leading-relaxed
                        line-clamp-2
                    ">

                    ${ticket.description}

                </p>


                <!-- CUSTOMER -->

                <div
                    class="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                        pt-4
                        mt-4
                        border-t
                        border-slate-100
                    ">


                    <div
                        class="
                            flex
                            flex-wrap
                            gap-x-5
                            gap-y-2
                            text-sm
                            text-slate-500
                        ">

                        <span>
                            👤 ${ticket.customer_name}
                        </span>

                        <span>
                            ✉ ${ticket.customer_email}
                        </span>

                    </div>


                    <span
                        class="
                            text-sm
                            font-medium
                            text-blue-600
                        ">

                        View ticket →

                    </span>

                </div>

            `;


            // ==================================
            // OPEN TICKET
            // ==================================

            card.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `ticket.html?id=${ticket.ticket_id}`;

                }
            );


            ticketList.appendChild(card);

        });

    }


    // ======================================
    // FILTER
    // ======================================

    function filterTickets() {

        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const status =
            statusFilter
                ? statusFilter.value
                : "";


        const priority =
            priorityFilter
                ? priorityFilter.value
                : "";


        const filtered =
            tickets.filter(ticket => {


                // ==========================
                // SEARCH
                // ==========================

                const searchableText = `

                    ${ticket.ticket_id}

                    ${ticket.customer_name}

                    ${ticket.customer_email}

                    ${ticket.subject}

                    ${ticket.description}

                `.toLowerCase();


                const matchesSearch =
                    searchableText.includes(
                        search
                    );


                // ==========================
                // STATUS
                // ==========================

                const matchesStatus =
                    !status ||
                    ticket.status === status;


                // ==========================
                // PRIORITY
                // ==========================

                const matchesPriority =
                    !priority ||
                    ticket.priority === priority;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority
                );

            });


        updateStatistics(
            filtered
        );


        renderTickets(
            filtered
        );

    }


    // ======================================
    // LOAD TICKETS
    // ======================================

    async function loadTickets() {

        console.log(
            "Loading tickets from FastAPI..."
        );


        try {

            if (loadingState) {

                loadingState.classList.remove(
                    "hidden"
                );

            }


            if (emptyState) {

                emptyState.classList.add(
                    "hidden"
                );

            }


            const response =
                await fetch(
                    "https://datastraw-support-crm-production-6bd5.up.railway.app/api/tickets/",
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );


            console.log(
                "API response:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Tickets loaded:",
                data
            );


            tickets =
                Array.isArray(data)
                    ? data
                    : [];


            updateStatistics(
                tickets
            );


            renderTickets(
                tickets
            );

        }


        catch (error) {

            console.error(
                "Failed to load tickets:",
                error
            );


            if (loadingState) {

                loadingState.classList.add(
                    "hidden"
                );

            }


            if (emptyState) {

                emptyState.classList.remove(
                    "hidden"
                );


                emptyState.innerHTML = `

                    <div
                        class="py-10 text-center">

                        <p
                            class="
                                text-red-500
                                font-medium
                            ">

                            Unable to load tickets

                        </p>


                        <p
                            class="
                                text-slate-500
                                text-sm
                                mt-2
                            ">

                            ${error.message}

                        </p>

                    </div>

                `;

            }

        }

    }


    // ======================================
    // SEARCH EVENT
    // ======================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterTickets
        );

    }


    // ======================================
    // STATUS EVENT
    // ======================================

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterTickets
        );

    }


    // ======================================
    // PRIORITY EVENT
    // ======================================

    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            filterTickets
        );

    }


    // ======================================
    // START ONCE
    // ======================================

    loadTickets();

}