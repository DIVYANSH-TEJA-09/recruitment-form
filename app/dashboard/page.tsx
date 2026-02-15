
"use client";

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function Dashboard() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Load data from Google Sheets API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/responses');
                const result = await response.json();
                if (result.success) {
                    setSubmissions(result.data.reverse()); // Newest first
                } else {
                    console.error("Failed to fetch dashboard data");
                }
            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate Metrics
    const totalResponses = submissions.length;

    // Branch Distribution Data
    const branchCounts: Record<string, number> = {};
    submissions.forEach(sub => {
        const branch = sub.branch || 'Unknown';
        branchCounts[branch] = (branchCounts[branch] || 0) + 1;
    });

    const branchData = Object.keys(branchCounts).map(key => ({
        name: key,
        value: branchCounts[key]
    }));

    const COLORS = ['#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f0ebf8]">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f0ebf8] p-4 sm:p-8 font-sans text-[#202124]">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-normal">Recruitment Dashboard</h1>
                    <p className="text-sm text-gray-600">Dev Catalyst • Response Summary</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-white border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50 shadow-sm"
                >
                    Refresh Data
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Metric Card 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-[#673ab7]">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Responses</h3>
                    <p className="text-4xl font-normal mt-2">{totalResponses}</p>
                </div>

                {/* Metric Card 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-[#3f51b5]">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Latest Response</h3>
                    <p className="text-lg mt-2 truncate">
                        {submissions.length > 0 ? new Date(submissions[0].timestamp).toLocaleString() : "N/A"}
                    </p>
                </div>

                {/* Metric Card 3 - Placeholder / Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-[#2196f3]">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Status</h3>
                    <p className="text-lg mt-2 text-green-600">Active • Accepting</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-normal mb-6">Branch Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={branchData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {branchData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-normal">Recent Submissions</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Timestamp</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Roll Number</th>
                                    <th className="px-6 py-3">Branch</th>
                                    <th className="px-6 py-3">Selected Track</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No submissions yet.</td>
                                    </tr>
                                ) : (
                                    submissions.map((sub, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {new Date(sub.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium">{sub.full_name}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{sub.roll_number}</td>
                                            <td className="px-6 py-4">{sub.branch}</td>
                                            <td className="px-6 py-4 text-[#673ab7] font-medium">{sub.selected_track}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
