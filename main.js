$(document).ready((evt) => {
    let div1 = $("#firstDiv");
    let div2 = $("#secondDiv");
    let div3 = $("#thirdDiv");
    let gNum = document.getElementById("gNumInput");
    let gNumBtn = $("#gNumBtn");
    div2.hide();
    div3.hide();
    gNumBtn.click((e) => {
        var n = parseInt(gNum.value);
        div1.hide();
        div2.show();

        div2.prepend("<table></table>");
        let div2table = $("#secondDiv table");
        for (let i = 0; i < n; i++) {
            let tr = document.createElement("tr");

            div2table.append(tr);
            for (let j = 0; j < n; j++) {
                let div2tableTr = $("#secondDiv table tr")[i];
                let td = document.createElement("td");
                $(td).html("<input type='text' class='pathInput' id='path" + n*i+j + "'>")
                div2tableTr.append(td);
            }
        }
    });

    $("#calcButt").click((e) => {
        var n = parseInt(gNum.value);
        div2.hide();
        div3.show();
        div3.append("<table></table>");
        let div3table = $("#thirdDiv table");
        for (let i = 0; i < n; i++) {
            let tr = document.createElement("tr");

            div3table.append(tr);
            for (let j = 0; j < n; j++) {
                let div3tableTr = $("#thirdDiv table tr")[i];
                let td = document.createElement("td");
                $(td).html("<p class='path'>" + $(".pathInput")[n*i+j].value + "</p>")
                div3tableTr.append(td);
            }
        }
    })
});