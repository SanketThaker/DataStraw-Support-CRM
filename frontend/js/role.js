function selectRole(role){

    //Save Selected Role
    localStorage.setItem("userRole",role);

    //small transition before navigation
    document.body.classList.add("page-exit");

    setTimeout(()=>{

        if (role === "customer"){
            window.location.href = "customer.html";
        }

        if (role === "agent"){
            window.location.href ="agent.html";
        }
    },250);
}