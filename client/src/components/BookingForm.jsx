import DatePicker from "react-datepicker";

function BookingForm({
  booking,
  setBooking,
  vehicles,
  handleBooking,
  handleBookingChange,
  handleAddressChange,
  bookingSectionRef,
  bookings,
}) {

  const bookedDates =
    bookings.map(
      (b) =>
        new Date(
          b.bookingDate
        )
    );

  return (
    <section
      ref={bookingSectionRef}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
    >

      <h2 className="text-4xl font-black text-slate-900 mb-8">
        Book Service
      </h2>

      <form
        onSubmit={handleBooking}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >

        {/* VEHICLE */}
        <select
          name="vehicle"
          value={booking.vehicle}
          onChange={handleBookingChange}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        >
          <option value="">
            Select Vehicle
          </option>

          {vehicles.map((v) => (
            <option
              key={v._id}
              value={v._id}
            >
              {v.vehicleNumber}
            </option>
          ))}
        </select>

        {/* SERVICE TYPE */}
        <select
          name="serviceType"
          onChange={handleBookingChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        >
          <option value="GENERAL_SERVICE">
            General Service
          </option>

          <option value="REPAIR">
            Repair
          </option>

          <option value="CAR_WASH">
            Car Wash
          </option>

          <option value="BATTERY">
            Battery
          </option>

          <option value="PUNCTURE">
            Puncture
          </option>
        </select>

        {/* DATE */}
        <div className="w-full">

          <DatePicker
            selected={
              booking.bookingDate
                ? new Date(
                    booking.bookingDate
                  )
                : null
            }
            onChange={(date) =>
              setBooking({
                ...booking,
                bookingDate:
                  date
                    .toISOString()
                    .split("T")[0],
              })
            }
            minDate={
              new Date()
            }
            filterDate={(date) =>
              date.getDay() !== 0
            }
            highlightDates={
              bookedDates
            }
            placeholderText="Select Booking Date"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
            required
          />

        </div>

        {/* BOOKING TYPE */}
        <select
          name="bookingType"
          onChange={handleBookingChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        >
          <option value="SELF">
            Self Drop
          </option>

          <option value="PICKUP">
            Pickup
          </option>
        </select>

        {/* ISSUE */}
        <textarea
          name="issueDescription"
          placeholder="Describe vehicle issue"
          onChange={handleBookingChange}
          required
          className="w-full md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        />

        {/* DAMAGE IMAGE */}
        <div className="md:col-span-2">

          <label className="block text-sm font-bold text-slate-700 mb-2">
            Damage Image
          </label>

          <input
            type="file"
            name="damageImage"
            accept="image/*"
            onChange={handleBookingChange}
            className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4"
          />

        </div>

        {/* PICKUP ADDRESS */}
        {booking.bookingType ===
          "PICKUP" && (
          <>
            <input
              name="houseNo"
              required
              placeholder="House No"
              onChange={handleAddressChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"
            />

            <input
              name="street"
              required
              placeholder="Street"
              onChange={handleAddressChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"
            />

            <input
              name="area"
              required
              placeholder="Area"
              onChange={handleAddressChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"
            />

            <input
              name="landmark"
              placeholder="Landmark"
              onChange={handleAddressChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"
            />

            <input
              name="city"
              defaultValue="Bengaluru"
              onChange={handleAddressChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"
            />

            <input
              name="state"
              defaultValue="Karnataka"
              onChange={handleAddressChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"
            />

            <input
              name="pincode"
              placeholder="Pincode"
              maxLength="6"
              inputMode="numeric"
              pattern="\d{6}"
              required
              onChange={handleAddressChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"
            />
          </>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] hover:shadow-xl transition-all text-white font-bold py-4 rounded-2xl text-lg"
        >
          Book Now
        </button>

      </form>

    </section>
  );
}

export default BookingForm;