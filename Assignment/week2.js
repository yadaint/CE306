// 1. ดึง Element จาก HTML มาเก็บไว้ในตัวแปร เพื่อให้ JS สั่งงานได้
const currencyEl_one = document.getElementById('currency-one'); // สกุลเงินบน
const amountEl_one = document.getElementById('amount-one'); // ช่องกรอกเลขบน
const currencyEl_two = document.getElementById('currency-two'); // สกุลเงินล่าง
const amountEl_two = document.getElementById('amount-two'); // ช่องกรอกเล็กล่าง
const rateEl = document.getElementById('rate'); // ข้อความเรทเงิน
const timeEl = document.getElementById('last-updated'); // ข้อความบอกเวลา
const clearDataBtn = document.getElementById('clear-data-btn'); // ปุ่มล้างข้อมูล
const historyList = document.getElementById('history-list'); // กล่องโชว์ประวัติ
const clearHistoryBtn = document.getElementById('clear-history-btn'); // ปุ่มล้างประวัติ

// สร้าง Array ว่างๆ เป็นกล่องสำหรับเก็บข้อความประวัติการแปลงเงิน
let conversionHistory = [];

// 2. ฟังก์ชันหลักสำหรับดึง API และคำนวณเงิน
// ใส่ตัวแปร isReverse ไว้เช็คว่าเรากำลังแปลงจาก บนลงล่าง (false) หรือ ล่างขึ้นบน (true)
function calculate(isReverse = false) {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    // ใช้คำสั่ง fetch ดึงข้อมูลเรทเงินจากเว็บ API ฟรี
    fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
        .then(res => res.json()) // แปลงข้อมูลที่ได้มาให้อยู่ในรูปแบบ JSON ที่ JS อ่านออก
        .then(data => {
            const rate = data.rates[currency_two]; // ดึงเรทของสกุลเงินปลายทางมาเก็บไว้
            
            // โชว์เรทเงินตรงกลางหน้าจอ (ใช้ toFixed(4) เพื่อบังคับให้มีทศนิยม 4 ตำแหน่ง)
            rateEl.innerText = `1 ${currency_one} = ${rate.toFixed(4)} ${currency_two}`;
            
            // เรียกฟังก์ชันอัปเดตเวลาเพื่อให้รู้ว่าดึงข้อมูลตอนไหน
            updateTime();

            let val1, val2; // สร้างตัวแปรมารอรับค่าเพื่อส่งเข้าประวัติ
            
            // ตรรกะการคำนวณ [โจทย์ที่ 1: แปลงสองทิศทาง]
            if (!isReverse) {
                // กรณี: พิมพ์ที่ช่องบน (แปลงจากต้นทางไปปลายทาง)
                if (amountEl_one.value !== '') {
                    // เอาค่าช่องบน x เรทเงิน = ได้ช่องล่าง (ตัดทศนิยมเหลือ 2 ตำแหน่งด้วย toFixed(2))
                    amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
                    val1 = amountEl_one.value;
                    val2 = amountEl_two.value;
                    addToHistory(val1, currency_one, val2, currency_two); // โยนเข้าประวัติ
                }
            } else {
                // กรณี: พิมพ์ที่ช่องล่าง (แปลงย้อนกลับ จากปลายทางไปต้นทาง)
                if (amountEl_two.value !== '') {
                    // เอาค่าช่องล่าง / เรทเงิน = ได้ช่องบนย้อนกลับไป
                    amountEl_one.value = (amountEl_two.value / rate).toFixed(2);
                    val1 = amountEl_one.value;
                    val2 = amountEl_two.value;
                    addToHistory(val1, currency_one, val2, currency_two); // โยนเข้าประวัติ
                }
            }
        });
}

// 3. ฟังก์ชันดึงเวลาปัจจุบันมาแสดง [โจทย์ที่ 4]
function updateTime() {
    const now = new Date(); // ดึงวันและเวลาปัจจุบันของเครื่องคอมพิวเตอร์
    // จัด format ให้เป็นรูปแบบของไทยแบบอ่านง่ายๆ
    const timeString = now.toLocaleString('th-TH', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute:'2-digit', second:'2-digit' 
    });
    timeEl.innerText = `อัปเดตล่าสุด: ${timeString}`;
}

// 4. ฟังก์ชันจัดการประวัติ [โจทย์ที่ 2]
function addToHistory(amt1, cur1, amt2, cur2) {
    // แปลงตัวเลขให้มีลูกน้ำ (comma) เพื่อให้อ่านง่าย เช่น 1,000
    const formattedAmt1 = parseFloat(amt1).toLocaleString('th-TH');
    const formattedAmt2 = parseFloat(amt2).toLocaleString('th-TH');
    
    // เอาตัวเลขและสกุลเงินมาต่อกันเป็นประโยค เช่น "1,000 THB → 28.17 USD"
    const record = `${formattedAmt1} ${cur1} → ${formattedAmt2} ${cur2}`;
    
    // กันเหนียว ถ้าเกิดระบบมันคำนวณซ้ำแล้วได้ค่าเดิมเป๊ะๆ ก็ไม่ต้องบันทึกซ้ำลงประวัติ
    if(conversionHistory[0] === record) return;

    // ใช้คำสั่ง unshift() เพื่อยัดข้อมูลใหม่ไปไว้ "ตำแหน่งแรกสุด (บนสุด)" ของ Array
    conversionHistory.unshift(record);

    // เช็คว่าถ้าประวัติเกิน 10 รายการ ให้ใช้ pop() เตะรายการท้ายสุด (เก่าสุด) ทิ้งไป
    if(conversionHistory.length > 10) {
        conversionHistory.pop(); 
    }
    
    // สั่งให้อัปเดตหน้าจอ
    renderHistory();
}

// 5. ฟังก์ชันเอาข้อมูลประวัติมาวาดแสดงบนหน้าเว็บ
function renderHistory() {
    historyList.innerHTML = ''; // เคลียร์ข้อความเก่าบนหน้าทิ้งก่อน
    // วนลูปเอาข้อมูลใน Array มาสร้างเป็นแท็ก <li> ทีละบรรทัด
    conversionHistory.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        historyList.appendChild(li);
    });
}

// 6. ดักจับเหตุการณ์ (Event Listeners) ว่ายูสเซอร์พิมพ์ตัวเลขหรือยัง
// ใช้ 'change' เพื่อให้ระบบรันตอนที่ "พิมพ์เสร็จแล้ว" (คลิกที่อื่นหรือกด Enter) จะได้ไม่รันมั่วตอนกำลังพิมพ์ทีละตัว
amountEl_one.addEventListener('change', () => calculate(false));
amountEl_two.addEventListener('change', () => calculate(true)); // ช่องล่างส่งค่า true ไป เพื่อให้รู้ว่าแปลงย้อนกลับ
currencyEl_one.addEventListener('change', () => calculate(false));
currencyEl_two.addEventListener('change', () => calculate(false));

// 7. ปุ่มล้างข้อมูลช่องกรอกเลข [โจทย์ที่ 3]
clearDataBtn.addEventListener('click', () => {
    amountEl_one.value = '';
    amountEl_two.value = '';
    rateEl.innerText = '1 THB = x.xx USD';
    timeEl.innerText = 'รอการดึงข้อมูลอัตราแลกเปลี่ยน...';
});

// 8. ปุ่มล้างประวัติ
clearHistoryBtn.addEventListener('click', () => {
    conversionHistory = []; // ล้างของใน Array ให้กลายเป็นช่องว่างเปล่า
    renderHistory(); // อัปเดตหน้าจอใหม่ (มันจะหายไปหมด)
});

// 9. เรียกใช้งานฟังก์ชันคำนวณทันที 1 ครั้ง ตอนที่เพิ่งเปิดหน้าเว็บขึ้นมา เพื่อดึงเรทตั้งต้น
calculate();