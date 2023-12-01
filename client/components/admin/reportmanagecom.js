import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "@/function/Pagination"; // Assuming you have a Pagination component

function ReportManagementcom() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [inputValues, setInputValues] = useState({ title: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Show 10 items per page

  const getReports = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/report");
      setReports(result.data.data.sort((a, b) => a.report_id - b.report_id));
    } catch (error) {
      console.error("Error fetching Reports:", error);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  const handleClickEdit = (report) => {
    setSelectedReport(report);
  };

  const handleClearFields = () => {
    setSelectedReport(null);
    setInputValues({ title: "", description: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReport({ ...selectedReport, [name]: value });
  };

  const handleClickDelete = () => {
    const report_id = selectedReport?.report_id;
    if (!report_id) {
      Swal.fire("Please select a report to delete", "", "warning");
      return;
    }

    Swal.fire({
      title: "Delete Report",
      text: "Are you sure you want to delete this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete("http://localhost:8080/api/report/" + report_id);
          if (response.status === 200) {
            setSelectedReport(null);
            setReports(reports.filter((report) => report.report_id !== report_id));
            Swal.fire({
              title: "Success!",
              text: response.data.message,
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire("Error deleting report", "", "error");
          }
        } catch (error) {
          console.error("Error deleting report:", error);
          Swal.fire("Error deleting report", "", "error");
        }
      }
    });
  };

  // Get current reports
  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="report-component card bg-base-100 shadow-xl ">
      <div className="reporttop card bg-primary flex justify-center ">
        <h2 className="text-base-100">REPORT</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 &&
              currentReports.map((item) => (
                <tr key={item.report_id}>
                  <td>{item.report_id}</td>
                  <td>{item.report_title}</td>
                  <td>{item.report_desc}</td>
                  <td>{item.createdAt}</td>
                  <td>
                    <button className="btn btn-warning w-24" onClick={() => handleClickEdit(item)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
         </div>
      <Pagination itemsPerPage={itemsPerPage} totalItems={reports.length} paginate={paginate} />
     
      <div className="report-cand card grid grid-row-3 grid-cols-2">
        <div className="reporttop card row-start-1 col-start-1 col-span-2 flex justify-center">
          <h2 className="card text-base-100 bg-primary">EDIT</h2>
        </div>

        <form className="grid grid-rows-1 grid-cols-2 row-start-2 col-start-1 col-span-2 ">
          <div className="ml-5 col-start-1 " style={{ justifySelf: "end" }}>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered w-full max-w-xs "
              value={selectedReport?.report_title || ""}
              readOnly
            />
          </div>

          <div className="ml-5 col-start-2">
            <label className="label">
              <span className="label-text">Detail</span>
            </label>
            <textarea
              type="text"
              placeholder="Detail"
              className="report-detail w-full h-500 col-span-4 appearance-none block rounded-lg bg-base-100 border py-4 px-3 focus:outline-none resize-none"
              name="Description"
              value={selectedReport?.report_desc || ""}
              style={{ resize: "none", width: "600px", height: "100px" }}
              readOnly
            />
          </div>
        </form>

        <div className="row-start-3 grid grid-cols-2 col-start-1 col-span-2 mt-5 gap-5 mb-3">
          <button className="btn btn-error mt-3 col-start-1 w-64 ml-auto" onClick={handleClickDelete}>
            DELETE
          </button>
          <button className="btn mt-3 col-start-2 inset-y-0 left-0 w-64" onClick={handleClearFields}>
            CLEAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportManagementcom;
