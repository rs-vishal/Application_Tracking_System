import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Recruiterjobs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchJob = async () => {
      const res = await axios.get(`http://localhost:4000/api/recruiter/job/${id}`);
      setJob(res.data);
      setFormData(res.data);
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4000/api/recruiter/job/${id}`, formData);
      setJob(formData);
      setEditMode(false);
      alert('Job updated');
    } catch (err) {
      alert('Failed to update job');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`http://localhost:4000/api/recruiter/job/${id}`);
      alert('Job deleted');
      navigate('/jobs');
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
      {editMode ? (
        <div className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
          <input name="company" value={formData.company} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
          <input name="salary" value={formData.salary} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded mr-2">Save</button>
          <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Salary:</strong> {job.salary ? `$${job.salary}` : 'Not specified'}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <button onClick={() => setEditMode(true)} className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded mr-2">Edit</button>
          <button onClick={handleDelete} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded">Delete</button>
        </div>
      )}
    </div>
  );
};

export default Recruiterjobs;