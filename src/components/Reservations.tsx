import { useEffect, useMemo, useState } from "react";
import "./styles/Reservations.css";
import Calendar from "./Calendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

function Reservations() {
    const [showCalendarLayout, setShowCalendarLayout] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [hour, setHour] = useState(new Date().getHours());
    const [reservations, setReservations] = useState(null);
    const [hourAsString, setHourAsString] = useState("");
    const [reservationOwner, setReservationOwner] = useState(null);
    const [reservationWindow, showReservationWindow] = useState(false);
    const [partySize, setPartySize] = useState(null);
    const [reservationEndTime, setReservationEndTime] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [informationPresentedType, setInformationPresentedType] = useState(null);
    const [nameOfParty, setNameOfParty] = useState(null);
    const [reservedBy, setReservedBy] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setReservationOwner(localStorage.getItem('username') || '');
    }, []);

    const prevHour = () => setHour((h) => (h + 23) % 24);
    const nextHour = () => setHour((h) => (h + 1) % 24);

    const getReservationsPerHour = (reservations, hour) => {
        if (!Array.isArray(reservations)) return [];
        return reservations.filter(r =>
            Number(r.reservation_startHour) <= hour &&
            Number(r.reservation_endHour) > hour
        );
    };

    const reservationsForHour = useMemo(() => {
        return getReservationsPerHour(reservations, hour);
    }, [reservations, hour]);

    const AMPMConverter = (time) => {
        if (time === 0) return "12AM";
        if (time === 12) return "12PM";
        if (time > 12) return (time - 12).toString() + "PM";
        return time.toString() + "AM";
    };

    const todaysReservations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/getReservationsForTheDay', {
                params: { todaysDate: selectedDate }
            });
            setReservations(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error grabbing reservations: ', err);
        }
    }

    const scheduleReservation = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/makeReservation', {
                reserved_by: reservationOwner, reservation_startHour: hour, reservation_date: selectedDate,
                reservation_endHour: reservationEndTime, reservationSize: partySize, reservation_table: selectedTable
            });
            navigate("/");
        } catch (err) {
            console.error("Error making reservation: ", err);
        }
    }

    useEffect(() => {
        setHourAsString(AMPMConverter(hour));
    }, [hour]);

    useEffect(() => {
        if (selectedDate) todaysReservations();
    }, [selectedDate]);


    const layout = useMemo(() => Array.from({ length: 8 }, (_, i) => `T${i + 1}`), []);

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setShowCalendarLayout(false);
    };

    const handleBack = () => {
        setShowCalendarLayout(true);
    };

    const tableReservations = reservationsForHour.reduce((tableMap, reservation) => {
        tableMap[Number(reservation.reservation_table)] = {
            reservedBy: reservation.reserved_by,
            endHour: Number(reservation.reservation_endHour)
        };
        return tableMap;
    }, {});

    const tableBookedStatus = reservationsForHour.reduce((tableMap, reservation) => {
        tableMap[Number(reservation.reservation_table)] = true;
        return tableMap;
    }, {});

    const idToNumId = (tableId: string) => parseInt(tableId.slice(1), 10);

    const displayAppropriateTableInfo = (tableId: number, isReserved: boolean) => {
        if (selectedTable === tableId) {
            setSelectedTable(null);
            setInformationPresentedType(null);
            setReservedBy(null);
            return;
        }
        setSelectedTable(tableId);
        if (isReserved) {
            setInformationPresentedType("Reserved");
            setReservedBy(tableReservations[tableId]?.reservedBy || null);
        } else {
            setInformationPresentedType("Free");
            setReservedBy(null);
        }
    };

    return (
        <div className="Reservations">
            <NavigationBar />

            <div className="ReservationsContent"
                style={{
                    paddingTop: showCalendarLayout
                        ? "24px"                
                        : "200px"               
                }}>
                {showCalendarLayout ? (
                    <div className="CalendarWrapper">
                        <Calendar onDayClick={handleDayClick} />
                    </div>
                ) : (
                    <div className="RestaurantMapWrapper">
                        <div className="MapHeader">
                            <button className="BackButton" onClick={() => setShowCalendarLayout(true)}>
                                ← Back to Calendar
                            </button>
                            <h1 className="RestaurantResTitle">Reservations for Mike's Ristorante</h1>
                            <div className="SlotHeader">
                                <button className="TimeArrow" onClick={prevHour}>{"<"}</button>
                                <div className="TimeReadout">{hourAsString}</div>
                                <button className="TimeArrow" onClick={nextHour}>{">"}</button>
                            </div>
                        </div>

                        <div className="RestaurantMap">
                            {layout.map((tableId) => {
                                const idNum = idToNumId(tableId);
                                const isReserved = !!tableBookedStatus[idNum];

                                return (
                                    <div
                                        key={tableId}
                                        className={`Table ${isReserved ? "Reserved" : ""}`}
                                        onClick={() => displayAppropriateTableInfo(idNum, isReserved)}
                                    >
                                        <div className="TableLabel">{tableId}</div>

                                        {selectedTable === idNum && (
                                            <div
                                                className={`InfoModal ${isReserved ? "reserved" : "available"}`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="InfoModal__content">
                                                    {informationPresentedType === "Reserved" ? (
                                                        <>
                                                            <h1>{reservedBy}'s Table</h1>
                                                            <p>
                                                                {reservedBy} will be here until{" "}
                                                                {AMPMConverter(tableReservations[selectedTable]?.endHour ?? 0)}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <h1>Please Enter the size of your party.</h1>
                                                            <form onSubmit={scheduleReservation}>
                                                                <input
                                                                    type="number"
                                                                    className="PartyUp"
                                                                    required
                                                                    onChange={(e) => setPartySize(Number(e.target.value))}
                                                                />

                                                                <h1>What time will you be staying with us until?</h1>
                                                                <select
                                                                    required
                                                                    onChange={(e) => setReservationEndTime(Number(e.target.value))}
                                                                >
                                                                    <option value="">Select the hour you will stay until</option>
                                                                    {Array.from({ length: 24 - hour }, (_, i) => hour + i + 1).map((h) => (
                                                                        <option key={h} value={h}>
                                                                            {AMPMConverter(h)}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                                <button className="SubmitCannoli"></button>
                                                            </form>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default Reservations;