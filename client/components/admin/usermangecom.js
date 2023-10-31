import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";


function usermangecom() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const getUser = async () => {
    let result = await axios.get('http://localhost:8080/api/user');
    setUsers(result.data.data.sort((a, b) => a.user_id - b.user_id));
    console.log(result.data.data);
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleClickAdd = () => {
    // TODO: เพิ่มผู้ใช้ใหม่
  };

  const handleClickEdit = (user) => {
    setSelectedUser(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleClickDelete = () => {
    const user_id = selectedUser?.user_id;

    // ตรวจสอบว่า selectedUser มีค่าหรือไม่
    if (!user_id) {
      // แสดงข้อความแจ้งเตือน
      Swal.fire('Please select a user to delete', '', 'warning');
      return;
    }

    Swal.fire({
      title: 'Delete user',
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // ลบผู้ใช้จาก database
        const response = await axios.delete('http://localhost:8080/api/user/' + user_id);

        if (response.status === 200) {
          // ลบข้อมูลออกจาก state
          setSelectedUser(null);

          // อัปเดตรายการผู้ใช้หลังจากลบ
          setUsers(users.filter(user => user.user_id !== user_id));
        } else {
          Swal.fire('Error deleting user', '', 'error');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const user_id = selectedUser?.user_id;
  
    // ตรวจสอบว่า selectedUser มีค่าหรือไม่
    if (!selectedUser) {
      Swal.fire('Please fill in all required fields', '', 'warning');
      return;
    }
  
    // ตรวจสอบว่า username และ password ไม่ว่าง
    if (!selectedUser.username || !selectedUser.password) {
      Swal.fire('Please fill in all required fields', '', 'error');
      return;
    }
  
    const response = await axios.put('http://localhost:8080/api/user/' + user_id, {
      username: selectedUser.username,
      password: selectedUser.password,
    });
  
    // ตรวจสอบสถานะการตอบกลับ
    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        showConfirmButton: false,
        timer: 1500
      })
      // รีโหลดหน้า
      setTimeout(function(){
        window.location.reload();
     }, 1500);
    } else {
      alert('Error!');
    }
  };
  
  

  return (
    <div className="report-component card  bg-base-100 shadow-xl  ">
      <div className="reporttop card  bg-primary  flex justify-center">
            <h2 className="  text-base-100  ">USER</h2>                    
       </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* render users data */}
            {users.length > 0 &&
              users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleClickEdit(user)}>SELECT</button>
                    <button className="btn btn-error" onClick={handleClickDelete}>DELETE</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="card  grid-cols-1  ">
          <div className="reporttop card  bg-primary  flex justify-center mt-3">
              <h2 className="  text-base-100  ">EDIT</h2>                    
          </div>
          <form className="mt-5 grid grid-cols-2" onSubmit={handleSubmit}>
          <div className="ml-5">
            <label className="label">
              <span className="label-text">ID</span>
            </label>
            <input type="text" placeholder="ID" className="input input-bordered w-full max-w-xs" value={selectedUser?.user_id || ""} readOnly />
            </div>

            <div className="ml-5">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input type="text" placeholder="Email" className="input input-bordered w-full max-w-xs" value={selectedUser?.email || ""} readOnly />
            </div>

            <div className="ml-5">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" name="username" value={selectedUser?.username || ""} onChange={handleInputChange} />
            </div>

            <div className="ml-5">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input type="text" placeholder="Password" className="input input-bordered w-full max-w-xs" name="password" value={selectedUser?.password || ""} onChange={handleInputChange} />
            </div>
          
          <button className="btn btn-success mt-5 col-span-2" type="submit">SAVE</button>
          </form>
      </div>
    </div>
  );
}

export default usermangecom;
