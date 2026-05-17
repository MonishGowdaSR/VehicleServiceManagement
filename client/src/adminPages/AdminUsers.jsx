import { useEffect, useState } from "react";
import axios from "axios";

import AdminLayout from "../adminLayout/AdminLayout";

function AdminUsers() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem(
                  "adminToken"
                )}`
            }
          }
        );

      setUsers(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <AdminLayout>

      <div className="p-8">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-5xl font-black text-slate-900">
            Users Management
          </h1>

          <p className="text-gray-500 mt-2 text-xl">
            Manage registered customers
          </p>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="text-left p-6 text-lg font-bold">
                    Customer
                  </th>

                  <th className="text-left p-6 text-lg font-bold">
                    Phone
                  </th>

                  <th className="text-left p-6 text-lg font-bold">
                    Email
                  </th>

                  <th className="text-left p-6 text-lg font-bold">
                    Role
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr
                    key={user._id}
                    className="border-t"
                  >

                    {/* USER */}

                    <td className="p-6">

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            user.profileImage
                              ? `http://localhost:5000/${user.profileImage}`
                              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt=""
                          className="w-14 h-14 rounded-full object-cover border"
                        />

                        <div>

                          <p className="font-bold text-lg">
                            {user.name}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* PHONE */}

                    <td className="p-6 text-gray-700 text-lg">
                      {user.phone}
                    </td>

                    {/* EMAIL */}

                    <td className="p-6 text-gray-700 text-lg">
                      {user.email}
                    </td>

                    {/* ROLE */}

                    <td className="p-6">

                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                        {user.role}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminUsers;