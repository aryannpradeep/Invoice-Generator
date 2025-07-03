let invoiceTable = document.querySelector("#invoiceTable tbody");
let grandTotalElement = document.getElementById("grandTotal");

function addItem() {
    let row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="text" placeholder="Item Name"></td>
        <td><input type="number" value="1" min="1" oninput="updateTotal(this)"></td>
        <td><input type="number" value="0" min="0" oninput="updateTotal(this)"></td>
        <td class="total-price">$0.00</td>
        <td><button class="btn btn-remove" onclick="removeItem(this)">Remove</button></td>
    `;

    invoiceTable.appendChild(row);
    updateGrandTotal();
}

function removeItem(button) {
    button.parentElement.parentElement.remove();
    updateGrandTotal();
}

function updateTotal(input) {
    let row = input.parentElement.parentElement;
    let quantity = row.children[1].querySelector("input").value;
    let price = row.children[2].querySelector("input").value;
    let total = (quantity * price).toFixed(2);
    
    let currency = document.getElementById("currency").value;
    row.children[3].textContent = `${currency}${total}`;
    
    updateGrandTotal();
}

function updateGrandTotal() {
    let totalPrices = document.querySelectorAll(".total-price");
    let grandTotal = 0;
    let currency = document.getElementById("currency").value;
    
    totalPrices.forEach(item => {
        grandTotal += parseFloat(item.textContent.replace(/[^0-9.]/g, "")) || 0;
    });

    let taxRate = parseFloat(document.getElementById("taxRate").value) || 0;
    let discountRate = parseFloat(document.getElementById("discountRate").value) || 0;
    
    grandTotal += (grandTotal * taxRate) / 100;
    grandTotal -= (grandTotal * discountRate) / 100;

    grandTotalElement.textContent = `Grand Total: ${currency}${grandTotal.toFixed(2)}`;
}

function printInvoice() {
    window.print();
}

function downloadPDF() {
    let element = document.querySelector(".container");
    html2canvas(element).then(canvas => {
        let imgData = canvas.toDataURL("image/png");
        let pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10);
        pdf.save("invoice.pdf");
    });
}

function saveInvoice() {
    let invoiceData = {
        name: document.getElementById("customerName").value,
        number: document.getElementById("invoiceNumber").value,
        date: document.getElementById("invoiceDate").value
    };
    localStorage.setItem("invoice", JSON.stringify(invoiceData));
    alert("Invoice saved!");
}

function clearInvoice() {
    localStorage.removeItem("invoice");
    location.reload();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Load saved invoice
window.onload = function() {
    let savedInvoice = localStorage.getItem("invoice");
    if (savedInvoice) {
        let data = JSON.parse(savedInvoice);
        document.getElementById("customerName").value = data.name;
        document.getElementById("invoiceNumber").value = data.number;
        document.getElementById("invoiceDate").value = data.date;
    }
};
