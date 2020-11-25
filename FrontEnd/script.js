const URL = "https://mentorstudentassignmentproject.herokuapp.com";

function checkNull(item, itemName) {
    if (item.length === 0) {
        document.getElementById("errorTitle").innerText = "Validation Error";
        document.getElementById("errorText").innerText = itemName + " Can't be empty !";
        $("#errorModalLong").modal("show");
        return false;
    }
    return true;
}

function addStudent() {
    let Name = document.getElementById("Name").value;
    let Email = document.getElementById("email").value;
    let Mobile = document.getElementById("Mobile").value;
    let College = document.getElementById("College").value;

    let registerURL = URL + "/students";

    if (! checkNull(Name, "Name") || ! checkNull(Email, "Email") || ! checkNull(Mobile, "Mobile") || ! checkNull(College, "College")) {
        return;
    }
    let payload = {
        Name,
        Email,
        Mobile,
        College,
        Mentor: null
    };

    fetch(registerURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json"
        }
    }).then((res) => res.json()).then((res) => {
        if (!res.result) {
            document.getElementById("errorTitle").innerText = "Submission error !";
            document.getElementById("errorText").innerText = "Failed to add Student !";
            $("#errorModalLong").modal("show");
            return;
        }

        document.getElementById("errorTitle").innerText = "Success !";
        document.getElementById("errorText").innerText = "Student Added Successfully";
        document.getElementById("addForm").reset();
        $("#errorModalLong").modal("show");
    });
}

function addMentor() {
    let Name = document.getElementById("Name").value;
    let Email = document.getElementById("email").value;
    let Mobile = document.getElementById("Mobile").value;
    let Major = document.getElementById("Major").value;

    let registerURL = URL + "/mentor";

    if (! checkNull(Name, "Name") || ! checkNull(Email, "Email") || ! checkNull(Mobile, "Mobile")) {
        return;
    }
    let payload = {
        Name,
        Email,
        Mobile,
        Major,
        Students: []
    };

    fetch(registerURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json"
        }
    }).then((res) => res.json()).then((res) => {
        if (!res.result) {
            document.getElementById("errorTitle").innerText = "Submission error !";
            document.getElementById("errorText").innerText = "Failed to add Mentor !";
            $("#errorModalLong").modal("show");
            return;
        }

        document.getElementById("errorTitle").innerText = "Success !";
        document.getElementById("errorText").innerText = "Mentor Added Successfully";
        document.getElementById("addForm").reset();
        $("#errorModalLong").modal("show");
    });
}

function assign(ids, redirect = "mentorPage") {
    let [Name, mentorId, StudentId] = ids.split(",");
    let putURL = URL + "/mentor/" + mentorId;
    let payload = {
        studentId: StudentId,
        mentorName: Name
    };
    fetch(putURL, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json"
        }
    }).then((res) => res.json()).then((res) => {
        if (!res.result) {
            document.getElementById("errorTitle").innerText = "Submission error !";
            document.getElementById("errorText").innerText = "Failed to Assign mentor";
            $("#errorModalLong").modal("show");
            return;
        }
        document.getElementById("errorTitle").innerText = "Success !";
        document.getElementById("errorText").innerText = "Mentor Assigned Successfully";
        $("#errorModalLong").modal("show");
        if (redirect === "mentorPage") {
            addStudents(Name + "," + mentorId);
        } else {
            getStudents();
        }
    });
}

function addStudents(text) {
    let getURL = URL + "/students";
    let [Name, mentorId] = text.split(",");
    document.getElementById("titleOfPage").innerText = "Assign Students";
    document.getElementById("tableConetent").innerHTML = "";
    document.getElementById("tableConetent").innerHTML = "<h5 class='display-5 p-3' > Assign students to: " + Name + "</h5>";
    let table = document.createElement("table");
    table.classList.add("table", "table-dark");

    let thead = document.createElement("thead");
    let trh = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.setAttribute("scope", "col");
    th1.innerText = "#";
    let th2 = document.createElement("th");
    th2.setAttribute("scope", "col");
    th2.innerText = "Name";
    let th3 = document.createElement("th");
    th3.setAttribute("scope", "col");
    th3.innerText = "Email";
    let th4 = document.createElement("th");
    th4.setAttribute("scope", "col");
    th4.innerText = "College";
    let th5 = document.createElement("th");
    th5.setAttribute("scope", "col");
    th5.innerText = "Action";

    trh.append(th1, th2, th3, th4, th5);
    thead.append(trh);
    table.append(thead);

    let tbody = document.createElement("tbody");
    let rowNo = 1;

    fetch(getURL).then((res) => res.json()).then((res) => { 
        res.body.forEach((element) => {
            if (element.Mentor === null) {
                let tr = document.createElement("tr");
                let th1 = document.createElement("th");
                th1.setAttribute("scope", "row");
                th1.innerText = rowNo++;
                let td2 = document.createElement("td");
                td2.innerText = element.Name;
                let td3 = document.createElement("td");
                td3.innerText = element.Email;
                let td4 = document.createElement("td");
                td4.innerText = element.College;
                let td5 = document.createElement("td");
                let button = document.createElement("button");
                button.setAttribute("type", "button");
                button.classList.add("btn", "btn-warning");
                let stduentId = element._id;
                button.value = [Name, mentorId, stduentId];
                button.setAttribute("onclick", "assign(this.value)");
                button.innerText = "Add";
                td5.append(button);
                tr.append(th1, td2, td3, td4, td5);
                tbody.append(tr);

            }
        });
        table.append(tbody);
        document.getElementById("tableConetent").append(table);
    });
}

function getMentors() {
    let getURL = URL + "/mentor";
    fetch(getURL).then((res) => res.json()).then((res) => { // console.log(res);
        if (!res.result) {
            document.getElementById("errorTitle").innerText = "Fetch Error !";
            document.getElementById("errorText").innerText = "Failed fetch mentor list";
            $("#errorModalLong").modal("show");
            return;
        }

        let table = document.createElement("table");
        table.classList.add("table", "table-dark");

        let thead = document.createElement("thead");
        let trh = document.createElement("tr");
        let th1 = document.createElement("th");
        th1.setAttribute("scope", "col");
        th1.innerText = "#";
        let th2 = document.createElement("th");
        th2.setAttribute("scope", "col");
        th2.innerText = "Name";
        let th3 = document.createElement("th");
        th3.setAttribute("scope", "col");
        th3.innerText = "Email";
        let th4 = document.createElement("th");
        th4.setAttribute("scope", "col");
        th4.innerText = "Major";
        let th5 = document.createElement("th");
        th5.setAttribute("scope", "col");
        th5.innerText = "Action";

        trh.append(th1, th2, th3, th4, th5);
        thead.append(trh);
        table.append(thead);

        let tbody = document.createElement("tbody");
        let rowNo = 1;
        res.body.forEach((element) => {
            let tr = document.createElement("tr");
            let th1 = document.createElement("th");
            th1.setAttribute("scope", "row");
            th1.innerText = rowNo++;
            let td2 = document.createElement("td");
            td2.innerText = element.Name;
            let td3 = document.createElement("td");
            td3.innerText = element.Email;
            let td4 = document.createElement("td");
            td4.innerText = element.Major;
            let td5 = document.createElement("td");
            let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.classList.add("btn", "btn-warning");
            button.value = [element.Name, element._id];
            button.setAttribute("onclick", "addStudents(this.value)");
            button.innerText = "Assign Students";
            let button2 = document.createElement("button");
            button2.setAttribute("type", "button");
            button2.classList.add("btn", "btn-warning", "m-3");
            button2.value = [element.Name, element._id];
            button2.setAttribute("onclick", "getMentorStudents(this.value)");
            button2.innerText = "Get Students";

            td5.append(button, button2);
            tr.append(th1, td2, td3, td4, td5);
            tbody.append(tr);
        });
        table.append(tbody);
        document.getElementById("tableConetent").append(table);
    });
}

function getMentorStudents(text) {
    let [Name, mentorId] = text.split(",");
    document.getElementById("titleOfPage").innerText = "Mentor Students";
    document.getElementById("tableConetent").innerHTML = "";
    document.getElementById("tableConetent").innerHTML = "<h5 class='display-5 p-3' > Students of mentor: " + Name + "</h5>";
    let getURL = URL + "/students/" + mentorId;
    fetch(getURL).then((res) => res.json()).then((res) => { // console.log(res);
        if (!res.result) {
            document.getElementById("errorTitle").innerText = "Fetch Error !";
            document.getElementById("errorText").innerText = "Failed fetch mentor list";
            $("#errorModalLong").modal("show");
            return;
        }

        let table = document.createElement("table");
        table.classList.add("table", "table-dark");

        let thead = document.createElement("thead");
        let trh = document.createElement("tr");
        let th1 = document.createElement("th");
        th1.setAttribute("scope", "col");
        th1.innerText = "#";
        let th2 = document.createElement("th");
        th2.setAttribute("scope", "col");
        th2.innerText = "Name";
        let th3 = document.createElement("th");
        th3.setAttribute("scope", "col");
        th3.innerText = "Email";
        let th4 = document.createElement("th");
        th4.setAttribute("scope", "col");
        th4.innerText = "College";

        trh.append(th1, th2, th3, th4);
        thead.append(trh);
        table.append(thead);

        let tbody = document.createElement("tbody");
        let rowNo = 1;
        res.body.forEach((element) => {
            let tr = document.createElement("tr");
            let th1 = document.createElement("th");
            th1.setAttribute("scope", "row");
            th1.innerText = rowNo++;
            let td2 = document.createElement("td");
            td2.innerText = element.Name;
            let td3 = document.createElement("td");
            td3.innerText = element.Email;
            let td4 = document.createElement("td");
            td4.innerText = element.College;
            tr.append(th1, td2, td3, td4);
            tbody.append(tr);
        });
        table.append(tbody);
        document.getElementById("tableConetent").append(table);
    });
}
function getStudents() {
    let getURL = URL + "/students";
    document.getElementById("titleOfPage").innerText = "View Students";
    document.getElementById("tableConetent").innerHTML = "";
    fetch(getURL).then((res) => res.json()).then((res) => { // console.log(res);
        if (!res.result) {
            document.getElementById("errorTitle").innerText = "Fetch Error !";
            document.getElementById("errorText").innerText = "Failed fetch mentor list";
            $("#errorModalLong").modal("show");
            return;
        }

        let table = document.createElement("table");
        table.classList.add("table", "table-dark");

        let thead = document.createElement("thead");
        let trh = document.createElement("tr");
        let th1 = document.createElement("th");
        th1.setAttribute("scope", "col");
        th1.innerText = "#";
        let th2 = document.createElement("th");
        th2.setAttribute("scope", "col");
        th2.innerText = "Name";
        let th3 = document.createElement("th");
        th3.setAttribute("scope", "col");
        th3.innerText = "Email";
        let th4 = document.createElement("th");
        th4.setAttribute("scope", "col");
        th4.innerText = "Mentor";
        let th5 = document.createElement("th");
        th5.setAttribute("scope", "col");
        th5.innerText = "Action";

        trh.append(th1, th2, th3, th4, th5);
        thead.append(trh);
        table.append(thead);

        let tbody = document.createElement("tbody");
        let rowNo = 1;
        res.body.forEach((element) => {
            let tr = document.createElement("tr");
            let th1 = document.createElement("th");
            th1.setAttribute("scope", "row");
            th1.innerText = rowNo++;
            let td2 = document.createElement("td");
            td2.innerText = element.Name;
            let td3 = document.createElement("td");
            td3.innerText = element.Email;
            let td4 = document.createElement("td");
            if (element.Mentor === null) 
                td4.innerText = "Not assigned";
             else 
                td4.innerText = element.MentorName;
            

            let td5 = document.createElement("td");
            let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.classList.add("btn", "btn-warning");
            button.value = [element.Name, element._id];
            button.setAttribute("onclick", "changeMentor(this.value)");
            if (element.Mentor === null) 
                button.innerText = "Assign Mentor";
             else 
                button.innerText = "Change Mentor";
             td5.append(button);
            tr.append(th1, td2, td3, td4, td5);
            tbody.append(tr);
        });
        table.append(tbody);
        document.getElementById("tableConetent").append(table);
    });
}

function changeMentor(text) {
    let [Name, id] = text.split(",");
    document.getElementById("titleOfPage").innerText = "Assign Mentor to Student";
    document.getElementById("tableConetent").innerHTML = "";
    document.getElementById("tableConetent").innerHTML = "<h5 class='display-5 p-3' > Assign Mentor to: " + Name + "</h5>";

    let getURL = URL + "/mentor";
    fetch(getURL).then((res) => res.json()).then((res) => { // console.log(res);
        if (!res.result) {
            document.getElementById("errorTitle").innerText = "Fetch Error !";
            document.getElementById("errorText").innerText = "Failed fetch mentor list";
            $("#errorModalLong").modal("show");
            return;
        }

        let table = document.createElement("table");
        table.classList.add("table", "table-dark");

        let thead = document.createElement("thead");
        let trh = document.createElement("tr");
        let th1 = document.createElement("th");
        th1.setAttribute("scope", "col");
        th1.innerText = "#";
        let th2 = document.createElement("th");
        th2.setAttribute("scope", "col");
        th2.innerText = "Name";
        let th3 = document.createElement("th");
        th3.setAttribute("scope", "col");
        th3.innerText = "Email";
        let th4 = document.createElement("th");
        th4.setAttribute("scope", "col");
        th4.innerText = "Major";
        let th5 = document.createElement("th");
        th5.setAttribute("scope", "col");
        th5.innerText = "Action";

        trh.append(th1, th2, th3, th4, th5);
        thead.append(trh);
        table.append(thead);

        let tbody = document.createElement("tbody");
        let rowNo = 1;
        res.body.forEach((element) => {
            let tr = document.createElement("tr");
            let th1 = document.createElement("th");
            th1.setAttribute("scope", "row");
            th1.innerText = rowNo++;
            let td2 = document.createElement("td");
            td2.innerText = element.Name;
            let td3 = document.createElement("td");
            td3.innerText = element.Email;
            let td4 = document.createElement("td");
            td4.innerText = element.Major;
            let td5 = document.createElement("td");
            let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.classList.add("btn", "btn-warning");
            button.value = [element.Name, element._id, id];
            button.setAttribute("onclick", "assign(this.value, redirect='')");
            button.innerText = "Assign Mentor";
            td5.append(button);
            tr.append(th1, td2, td3, td4, td5);
            tbody.append(tr);
        });
        table.append(tbody);
        document.getElementById("tableConetent").append(table);
    });
}
