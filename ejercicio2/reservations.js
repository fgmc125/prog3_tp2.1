class Customer {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    get info() {
        return `Nombre: ${this.name}, Email: ${this.email}`;
    }
}

class Reservation {
    constructor(id, customer, date, guests) {
        this.id = id;
        this.customer = customer;
        this.date = new Date(date);
        this.guests = guests;
    }
    get info() {
        return `Fecha y Hora: ${this.date.toLocaleString()}, ${this.customer.info}, Número de Comensales: ${this.guests}`;
    }
    static validateReservation(reservationDate, guests) {
        const currentDate = new Date();
        const reservationDateTime = new Date(reservationDate);
        return reservationDateTime > currentDate && guests > 0;
    }
}

class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }
    addReservation(reservation) {
        this.reservations.push(reservation);
    }
    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach(reservation => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                <p class="subtitle has-text-primary">
                    Reserva ${reservation.id} - ${reservation.date.toLocaleString()}
                </p>
                <div class="card-content">
                    <div class="content">
                        <p>${reservation.info}</p>
                    </div>
                </div>
            `;
            container.appendChild(reservationCard);
        });
    }
}

document.getElementById("save-reservation").addEventListener("click", function (event) {
    event.preventDefault();
    const customerName = document.getElementById("customer-name").value;
    const customerEmail = document.getElementById("customer-email").value;
    const reservationDate = document.getElementById("reservation-date").value;
    const guests = parseInt(document.getElementById("guests").value);

    if (Reservation.validateReservation(reservationDate, guests)) {
        const customerId = restaurant.reservations.length + 1;
        const reservationId = restaurant.reservations.length + 1;
        const customer = new Customer(customerId, customerName, customerEmail);
        const reservation = new Reservation(reservationId, customer, reservationDate, guests);
        restaurant.addReservation(reservation);
        restaurant.render();
        document.getElementById("reservation-modal").classList.remove("is-active");
    } else {
        alert("Datos de reserva inválidos");
    }
});

const restaurant = new Restaurant("El Lojal Kolinar");
const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}

document.addEventListener("DOMContentLoaded", () => {
    const addReservationItem = document.querySelector(".navbar-item.add-reservation");
    const reservationModal = document.getElementById("reservation-modal");
    const closeModalButtons = document.querySelectorAll(".delete, .cancel-modal");

    function toggleModal() {
        reservationModal.classList.toggle("is-active");
    }

    addReservationItem.addEventListener("click", toggleModal);
    closeModalButtons.forEach(button => {
        button.addEventListener("click", toggleModal);
    });
});