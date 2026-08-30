// กล่องเก็บข้อมูลทั้งหมดที่พิมพ์เข้ามา
let dataList = [];
// ตัวเลขนับลำดับรายการ เริ่มที่ 1
let runId = 1; 

// คำสั่งตอนกดปุ่มเพิ่มข้อมูล
function saveData() {
    // ไปดูว่าในช่องพิมพ์อะไรมาบ้าง แล้วเอามาเก็บไว้
    let name = document.getElementById("name-input").value;
    let amount = parseFloat(document.getElementById("amount-input").value);
    let type = document.getElementById("type-input").value;
    let category = document.getElementById("category-input").value;

    // เช็คว่าลืมพิมพ์ชื่อหรือลืมใส่เงินหรือเปล่า
    if (name === "" || isNaN(amount) || amount <= 0) {
        alert("กรุณากรอกชื่อรายการและจำนวนเงินให้ถูกต้องครับ");
        return; // ถ้าไม่ครบก็หยุดแค่นี้ ไม่ต้องทำต่อ
    }

    // จับข้อมูลมามัดรวมกันเป็นก้อนเดียว
    let newData = {
        id: runId,
        name: name,
        amount: amount,
        type: type,
        category: category
    };

    // เอาข้อมูลก้อนเมื่อกี้ไปเก็บรวมในกล่องใหญ่
    dataList.push(newData);
    // บวกเลขลำดับรอไว้ให้รายการต่อไป
    runId++; 

    // ลบข้อความในช่องพิมพ์ให้ว่างพร้อมรับรอบใหม่
    document.getElementById("name-input").value = "";
    document.getElementById("amount-input").value = "";

    // สั่งให้หน้าจออัปเดตข้อมูลใหม่
    showData();
}

// คำสั่งโชว์รายการบนหน้าจอและบวกเลข
function showData() {
    // ดูว่าพิมพ์ค้นหาคำว่าอะไรอยู่
    let keyword = document.getElementById("search-input").value;
    
    // เตรียมกล่องสำหรับใส่รายการ
    let listElement = document.getElementById("history-list");
    // เคลียร์ของเก่าทิ้งก่อนเดี๋ยวซ้ำกัน
    listElement.innerHTML = ""; 

    let totalIncome = 0;
    let totalExpense = 0;

    // หยิบข้อมูลมาดูทีละอัน
    for (let i = 0; i < dataList.length; i++) {
        let item = dataList[i];

        // ถ้าชื่อรายการตรงกับที่พิมพ์ค้นหา ถึงจะเอามาโชว์
        if (item.name.includes(keyword)) {
            
            // สร้างแถวใหม่เตรียมไว้
            let li = document.createElement("li");

            // ดูว่าเป็นรายรับหรือรายจ่าย จะได้ใส่สีถูกและบวกเลขถูก
            if (item.type === "รายรับ") {
                li.className = "income-item";
                totalIncome = totalIncome + item.amount;
            } else {
                li.className = "expense-item";
                totalExpense = totalExpense + item.amount;
            }

            // ใส่ข้อความลงไปในแถว
            li.innerHTML = `
                <b>${item.name}</b> (${item.category}) <br>
                <small>ID: ${item.id} | ${item.type} | จำนวนเงิน: ${item.amount} บาท</small>
            `;

            // เอาแถวไปแปะบนหน้าเว็บ
            listElement.appendChild(li);
        }
    }

    // เอาเงินมารวมกัน
    let net = totalIncome - totalExpense;

    // เอาตัวเลขไปแปะโชว์บนหน้าเว็บ
    document.getElementById("total-income").innerText = totalIncome;
    document.getElementById("total-expense").innerText = totalExpense;
    document.getElementById("net-balance").innerText = net;
}

// คำสั่งลบข้อมูลทิ้งทั้งหมด
function deleteAll() {
    // เด้งถามก่อนว่าชัวร์ไหมที่จะลบ
    let check = confirm("คุณต้องการลบประวัติทั้งหมดใช่หรือไม่?");
    
    if (check === true) {
        // เทข้อมูลในกล่องทิ้งให้หมด
        dataList = []; 
        // ให้กลับไปนับหนึ่งใหม่
        runId = 1;     
        
        // ล้างคำที่พิมพ์ค้นหาค้างไว้
        document.getElementById("search-input").value = "";
        
        // อัปเดตหน้าจอ ข้อมูลก็จะหายวับไปเลย
        showData();
    }
}