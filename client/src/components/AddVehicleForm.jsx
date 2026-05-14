function AddVehicleForm({
  handleAdd,
  handleChange,
  setForm,
  form,
}) {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

      <h2 className="text-4xl font-black text-slate-900 mb-8">
        Add Vehicle
      </h2>

      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >

        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          onChange={handleChange}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        />

        <select
          name="vehicleType"
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        >
          <option value="CAR">
            Car
          </option>

          <option value="BIKE">
            Bike
          </option>

          <option value="E_CAR">
            E-Car
          </option>

          <option value="E_BIKE">
            E-Bike
          </option>

          <option value="RICKSHAW">
            Rickshaw
          </option>

          <option value="E_RICKSHAW">
            E-Rickshaw
          </option>
        </select>

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        />

        <input
          type="text"
          name="model"
          placeholder="Model"
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        />

        <select
          name="fuelType"
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        >
          <option value="PETROL">
            Petrol
          </option>

          <option value="DIESEL">
            Diesel
          </option>

          <option value="ELECTRIC">
            Electric
          </option>

          <option value="CNG">
            CNG
          </option>
        </select>

        {/* VEHICLE PHOTO */}
        <div>

          <label className="block text-sm font-bold text-slate-700 mb-2">
            Vehicle Photo
          </label>

          <input
            type="file"
            name="vehiclePhoto"
            accept="image/*"
            required
            onChange={(e) =>
              setForm({
                ...form,
                vehiclePhoto:
                  e.target.files[0],
              })
            }
            className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4"
          />

        </div>

        {/* LICENSE */}
        <div>

          <label className="block text-sm font-bold text-slate-700 mb-2">
            Driving License
          </label>

          <input
            type="file"
            name="licenseDocument"
            accept=".jpg,.jpeg,.png,.pdf"
            required
            onChange={(e) =>
              setForm({
                ...form,
                licenseDocument:
                  e.target.files[0],
              })
            }
            className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4"
          />

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-xl transition-all text-white font-bold py-4 rounded-2xl text-lg"
        >
          Add Vehicle
        </button>

      </form>

    </section>
  );
}

export default AddVehicleForm;