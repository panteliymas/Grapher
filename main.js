$(window).on("load", () => {
    let div2 = $("#secondDiv");
    let div3 = $("#thirdDiv");
    div2.hide();
    div3.hide();
});

$(document).ready(() => {
    let div1 = $("#firstDiv");
    let div2 = $("#secondDiv");
    let div3 = $("#thirdDiv");
    let gNum = document.getElementById("gNumInput");
    let gNumBtn = $("#gNumBtn");
    enterSend("#gNumInput", "#gNumBtn");
    let matrix = [];
    div2.hide();
    div3.hide();

    function enterSend(inp, div){
        $(inp).keypress((e) => {
            if (e.which == 13){
                $(div).click();
            }
        });
    }


    gNumBtn.click(() => {
        let n = parseInt(gNum.value);
        div1.hide();
        div2.show();

        div2.prepend("<table></table>");
        let div2table = $("#secondDiv table");
        for (let i = 0; i < n; i++) {
            let tr = document.createElement("tr");
            matrix.push([]);
            div2table.append(tr);
            for (let j = 0; j < n; j++) {
                let div2tableTr = $("#secondDiv table tr")[i];
                let td = document.createElement("td");
                $(td).html("<input type='text' class='pathInput' id='path" + n*i+j + "'>")
                div2tableTr.append(td);
                enterSend(".pathInput", "#calcButt");
            }
        }
    });

    $("#calcButt").click(() => {
        let n = parseInt(gNum.value);
        div2.hide();
        div3.show();
        div3.prepend("<table></table>");
        let div3table = $("#thirdDiv table");
        for (let i = 0; i < n; i++) {
            let tr = document.createElement("tr");

            div3table.append(tr);
            for (let j = 0; j < n; j++) {
                let div3tableTr = $("#thirdDiv table tr")[i];
                let td = document.createElement("td");
                matrix[i].push(($(".pathInput")[n*i+j].value == "") ? 0 : parseInt($(".pathInput")[n*i+j].value));
                $(td).html("<p class='path'>" + matrix[i][j] + "</p>")
                div3tableTr.append(td);
            }
        }
        let canvas = document.getElementById("canvG");
        if (canvas.getContext) {
            let ctx = canvas.getContext('2d');
            let R = 240,
                points = [],
                duga = 2 * Math.PI / n,
                center = [250, 250];
            for (let i = 0; i < n; i++){
                let px = center[0] + R * Math.cos(i * duga + Math.PI / 2);
                let py = center[1] - R * Math.sin(i * duga + Math.PI / 2);
                points.push([px, py]);
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, 2*Math.PI);
                ctx.fill();
                ctx.closePath();
            }
            for (let i = 0; i < n; i++){
                for (let j = 0; j < n; j++){
                    if (matrix[i][j] != 0 && i != j){
                        ctx.beginPath();
                        ctx.moveTo(points[i][0], points[i][1]);
                        ctx.lineTo(points[j][0], points[j][1]);
                        ctx.stroke();
                        ctx.closePath();
                        let t_an = Math.PI / 3,
                            side = 10,
                            s_v = [1, 0],
                            s_v_l = 1,
                            c_x = points[j][0], c_y = points[j][1],
                            c_v = [c_x - points[i][0], c_y - points[i][1]],
                            c_v_l = Math.sqrt(c_v[0] * c_v[0] + c_v[1] * c_v[1]),
                            v_a = Math.acos((s_v[0] * c_v[0] + s_v[1] * c_v[1]) / (s_v_l * c_v_l));
                        if (points[i][1] > c_y)
                            v_a *= -1;
                        //alert(v_a);
                        ctx.fillStyle = "black";
                        ctx.beginPath();
                        ctx.lineTo(
                            c_x - side * Math.cos(v_a + t_an / 2),
                            c_y - side * Math.sin(v_a + t_an / 2)
                        );
                        ctx.lineTo(
                            c_x - side * Math.cos(v_a - t_an / 2),
                            c_y - side * Math.sin(v_a - t_an / 2)
                        );
                        ctx.lineTo(c_x, c_y);
                        ctx.fill();
                        ctx.closePath();
                        ctx.font = "30px Comic Sans MS";
                        ctx.textAlign = "center";
                        ctx.fillStyle = "#1AA663";
                        ctx.fillText(
                            matrix[i][j].toString(),
                            c_x - 0.25 * R * Math.cos(v_a) - 15,
                            c_y - 0.25 * R * Math.sin(v_a) + 20
                        );
                        ctx.fillStyle = "red";
                    }
                }
            }
        }
        else
            $(canvas).html("Canvas is unsupported on this device.");

        div3.append("<p>Finding the minimal way from 1 to " + matrix.length + "</p>");
        let x_cur = 0;
        let state_cur = 0;
        let ways_state = [0];
        let used = [];
        div3.append("<ul>Setting states to the points:");
        for (let i = 0; i < matrix.length; i++) {
            ways_state.push(Infinity);
            div3.append("<li>S(g<sub>" + (i + 1) + "</sub>) = infinity;</li>");
        }
        ways_state[0] = 0;
        div3.append("</ul><p>g<sub>1</sub> is a start point, so S(g<sub>1</sub>) = 0;</p>");
        while (x_cur != matrix.length - 1) {
            let ways_to = [];
            used.push(x_cur);
            div3.append("<ul>From g<sub>" + (x_cur + 1) + "</sub> you can get to:");
            for (let i = 0; i < matrix.length; i++) {
                //alert(matrix[x_cur][0]);
                //alert(i);

                if (matrix[x_cur][i] != 0) {
                    ways_to.push(i);
                    div3.append("<li>g<sub>" + (i + 1) + "</sub></li>");
                }
            }
            div3.append("<p>Resetting points with new states: </p>");
            ways_to.forEach((value) => {
                if (!used.includes(value)) {
                    let ws = ways_state[value];
                    ways_state[value] = Math.min(ways_state[value], matrix[x_cur][value] + state_cur);
                    div3.append(
                        "<p>S(g<sub>" + (value + 1) + "</sub>) = min{S(g<sub>" + (value + 1) + "</sub>), current S + path<sub>" + (x_cur + 1) + "," + (value + 1) + "</sub>} = min{" + ws + ", " + state_cur + " + " + matrix[x_cur][value] + "} = " + ways_state[value] + ".</p>"
                    );
                }
            });
            ways_state[x_cur] = Infinity;
            x_cur = ways_state.indexOf(Math.min(...ways_state));
            div3.append("<p>Now, we add g<sub>" + (x_cur + 1) + "</sub> to the visited graphs and choose next graph by a selecting by min way:  </p>");
            ways_state.forEach((value, index) => {
                div3.append("<p>g<sub>" + (index + 1) + "</sub>: " + ((value == Infinity) ? "infinity" : value) + "</p>");
            })
            state_cur = Math.min(...ways_state);
            div3.append("<p>And we have selected g<sub>" + (x_cur + 1) + "</sub> for the next point with total length of " + state_cur + "</p>");
        }
        div3.append("<p>Congrats! We are at g<sub>" + (x_cur + 1) + "</sub> and total length is minimal and it is " + state_cur + "</p>");
    });

});
