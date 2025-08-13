import { useState } from "react";
import { useLoggedInUser } from "../../hooks/auth.hooks";
import { useGetAllMovies } from "../../hooks/movie.hooks";
import "./user.style.css";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useGetShowsByMovieId } from "../../hooks/theatre.hooks";
import { useMemo } from "react";
import moment from "moment";
import useRazorpay from "react-razorpay";
import { apiInstance } from "../../api";

const formatDateTime = (epochMs) => {
  const date = new Date(epochMs); // your timestamp is already in ms
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const UserDashboard = () => {
  const [Razorpay] = useRazorpay();
  const { data: user } = useLoggedInUser();
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const { data: movies, isLoading } = useGetAllMovies();

  const { data: shows } = useGetShowsByMovieId(selectedMovieId);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const showObj = useMemo(() => {
    console.log(shows);
    if (!shows || !selectedShowId) return null;
    const show = shows?.find((e) => e._id === selectedShowId);
    return show;
  }, [selectedShowId, shows]);

  async function handleCreateBooking() {
    const { data } = await apiInstance.post(`/booking/create`, {
      showId: selectedShowId,
      seatNumber: selectedSeat,
    });
    const order = data.order;

    const options = {
      key: "rzp_test_Fo95E8iL2BunUH",
      amount: order.amount,
      currency: order.currency,
      name: "BookingMyShow",
      order_id: order.id,
      handler: async function (response) {
        await apiInstance.post(`/booking/verify-payment`, {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          //signaturehash(secret, razorpay_order_id|razorpay_payment_id)
        });
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  console.log(user.firstname);
  // return (
  //   <div className="user_dashboard_container" style={{ padding: "20px" }}>
  //     <div>
  //       <h1>Hi {user.firstname}</h1>
  //       <div className="movie_display_grid">
  //         {movies?.map((movie) => (
  //           <div
  //             style={{ marginTop: "10px" }}
  //             key={movie._id}
  //             onClick={() => setSelectedMovieId(movie._id)}
  //           >
  //             <Card sx={{ maxWidth: 345 }}>
  //               <CardContent>
  //                 <Typography gutterBottom variant="h5" component="div">
  //                   {movie.title}
  //                 </Typography>
  //                 <Typography variant="body2" sx={{ color: "text.secondary" }}>
  //                   {movie.description}
  //                 </Typography>
  //               </CardContent>
  //             </Card>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     <div>
  //       {shows && (
  //         <div>
  //           {shows?.map((show) => (
  //             <div
  //               style={{ marginTop: "10px" }}
  //               onClick={() => setSelectedShowId(show._id)}
  //               key={show._id}
  //             >
  //               <Card sx={{ maxWidth: 345 }}>
  //                 <CardContent>
  //                   <Typography gutterBottom variant="h5" component="div">
  //                     {moment(show.startTimestamp).format(
  //                       "DD/MM/YY [at] hh:mm A"
  //                     )}{" "}
  //                     to
  //                     <br />
  //                     {moment(show.endTimestamp).format(
  //                       "DD/MM/YY [at] hh:mm A"
  //                     )}
  //                   </Typography>
  //                   <Typography gutterBottom variant="h5" component="div">
  //                     INR {show.price}
  //                   </Typography>
  //                   <Typography gutterBottom variant="h5" component="div">
  //                     At {show.theatreHallId.theatreId.name} -{" "}
  //                     {show.theatreHallId.theatreId.plot}{" "}
  //                     {show.theatreHallId.theatreId.street}
  //                   </Typography>
  //                 </CardContent>
  //               </Card>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>

  //     {/* <div>
  //       {showObj && (
  //         <div className="seats_container">
  //           {new Array(showObj.theatreHallId.seatingCapacity)
  //             .fill(1)
  //             .map((seat, index) => (
  //               <span
  //                 className={
  //                   index + 1 === selectedSeat ? "selected-seat" : null
  //                 }
  //                 onClick={() => setSelectedSeat(index + 1)}
  //                 key={index}
  //               >
  //                 {index + 1}
  //               </span>
  //             ))}
  //         </div>
  //       )}
  //       {selectedSeat && (
  //         <Button
  //           onClick={() => setSelectedSeat(null)}
  //           color="error"
  //           variant="outlined"
  //         >
  //           Clear
  //         </Button>
  //       )}
  //       {selectedSeat && (
  //         <Button onClick={handleCreateBooking} variant="contained">
  //           Book Now
  //         </Button>
  //       )}
  //     </div> */}
  //     <div>
  //       {showObj?.theatreHallId?.seatingCapacity && (
  //         <div
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "center",
  //           }}
  //         >
  //           <div className="screen">SCREEN</div>

  //           <div className="seats_container">
  //             {(() => {
  //               const totalSeats = showObj.theatreHallId.seatingCapacity;
  //               const seatsPerRow = 12;
  //               const rows = Math.ceil(totalSeats / seatsPerRow);
  //               const seatRows = [];

  //               for (let row = 0; row < rows; row++) {
  //                 const rowLabel = String.fromCharCode(65 + row); // A, B, C...
  //                 const rowSeats = [];

  //                 for (let col = 1; col <= seatsPerRow; col++) {
  //                   const seatNumber = row * seatsPerRow + col;
  //                   if (seatNumber > totalSeats) break;

  //                   rowSeats.push(
  //                     <span
  //                       key={seatNumber}
  //                       className={`seat ${
  //                         seatNumber === selectedSeat ? "selected-seat" : ""
  //                       }`}
  //                       onClick={() => setSelectedSeat(seatNumber)}
  //                     >
  //                       {rowLabel}
  //                       {col}
  //                     </span>
  //                   );
  //                 }

  //                 seatRows.push(
  //                   <div className="seat-row" key={row}>
  //                     {rowSeats}
  //                   </div>
  //                 );
  //               }

  //               return seatRows;
  //             })()}
  //           </div>

  //           <div className="legend">
  //             <span className="seat" style={{ backgroundColor: "#e0e0e0" }}>
  //               Available
  //             </span>
  //             <span
  //               className="seat"
  //               style={{ backgroundColor: "#4caf50", color: "white" }}
  //             >
  //               Selected
  //             </span>
  //           </div>

  //           {selectedSeat && (
  //             <div style={{ marginTop: "20px" }}>
  //               <Button
  //                 onClick={() => setSelectedSeat(null)}
  //                 color="error"
  //                 variant="outlined"
  //               >
  //                 Clear
  //               </Button>
  //               <Button
  //                 onClick={handleCreateBooking}
  //                 variant="contained"
  //                 style={{ marginLeft: "10px" }}
  //               >
  //                 Book Now
  //               </Button>
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
    <div className="user_dashboard_container">
      <h1 style={{ marginBottom: "20px" }}>Hi, {user.firstname}</h1>

      <div className="dashboard_grid">
        {/* Movie List Column */}
        <div className="dashboard_column">
          <Typography variant="h3" align="center">Movies</Typography>

          {movies?.map((movie) => (
            <div
              className={`movie_card ${
                selectedMovieId === movie._id ? "selected" : ""
              }`}
              key={movie._id}
              onClick={() => {
                setSelectedMovieId(movie._id);
                setSelectedShowId(null);
                setSelectedSeat(null);
              }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2">{movie.description}</Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Shows Column */}
        <div className="dashboard_column">
           <Typography variant="h3" align="center">Shows</Typography>
          {shows?.map((show) => (
            <div
              className={`show_card ${
                selectedShowId === show._id ? "selected" : ""
              }`}
              key={show._id}
              onClick={() => {
                setSelectedShowId(show._id);
                setSelectedSeat(null);
              }}
            >
              <Card>
                <CardContent>
                  {/* <Typography variant="body1">
                     {moment(show.startTimestamp).format(
                        "DD/MM/YY [at] hh:mm A"
                      )}{" "}
                      to
                      <br />
                      {moment(show.endTimestamp).format(
                        "DD/MM/YY [at] hh:mm A"
                      )}
                  </Typography> */}
                  <Typography variant="body1">
                    {formatDateTime(show.startTimeStamp)} to
                    <br />
                    {formatDateTime(show.endTimeStamp)}
                  </Typography>
                  <Typography>INR {show.price}</Typography>
                  <Typography>
                    At {show.theatreHallId.theatreId.name} -{" "}
                    {show.theatreHallId.theatreId.plot}{" "}
                    {show.theatreHallId.theatreId.street}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Seats Column */}
        <div className="dashboard_column seats_side">
         <Typography variant="h3" align="center">Hall Map</Typography><br />
          {showObj?.theatreHallId?.seatingCapacity && (
            <>
              <div className="screen">SCREEN</div>
              <div className="seats_container">
                {(() => {
                  const totalSeats = showObj.theatreHallId.seatingCapacity;
                  const seatsPerRow = 12;
                  const rows = Math.ceil(totalSeats / seatsPerRow);
                  const seatRows = [];

                  for (let row = 0; row < rows; row++) {
                    const rowLabel = String.fromCharCode(65 + row);
                    const rowSeats = [];

                    for (let col = 1; col <= seatsPerRow; col++) {
                      const seatNumber = row * seatsPerRow + col;
                      if (seatNumber > totalSeats) break;

                      rowSeats.push(
                        <span
                          key={seatNumber}
                          className={`seat ${
                            seatNumber === selectedSeat ? "selected-seat" : ""
                          }`}
                          onClick={() => setSelectedSeat(seatNumber)}
                        >
                          {rowLabel}
                          {col}
                        </span>
                      );
                    }

                    seatRows.push(
                      <div className="seat-row" key={row}>
                        {rowSeats}
                      </div>
                    );
                  }

                  return seatRows;
                })()}
              </div>

              <div className="legend">
                <span className="seat" style={{ backgroundColor: "#e0e0e0" }}>
                  Available
                </span>
                <span
                  className="seat"
                  style={{ backgroundColor: "#4caf50", color: "white" }}
                >
                  Selected
                </span>
              </div>

              {selectedSeat && (
                <div style={{ marginTop: "20px" }}>
                  <Button
                    onClick={() => setSelectedSeat(null)}
                    color="error"
                    variant="outlined"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleCreateBooking}
                    variant="contained"
                    style={{ marginLeft: "10px" }}
                  >
                    Book Now
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
