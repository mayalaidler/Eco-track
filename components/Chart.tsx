import React, { useState, useEffect, useMemo } from 'react';
import { getRealTimeCO2 } from '../services/geminiService';
import type { CO2DataPoint } from '../types';
import Spinner from './Spinner';

interface AirQualityChartProps {
  onBack: () => void;
}

const MAX_DATA_POINTS = 30; // Show last 30 data points (~15 minutes)
const POLLING_INTERVAL = 30000; // 30 seconds

const Chart: React.FC<{ data: CO2DataPoint[] }> = ({ data }) => {
    const width = 600;
    const height = 350;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const { xScale, yScale, linePath, yAxisTicks } = useMemo(() => {
        if (!data.length) return { xScale: null, yScale: null, linePath: '', yAxisTicks: [] };

        const co2Values = data.map(d => d.co2);
        const yDomain = [Math.min(...co2Values) - 5, Math.max(...co2Values) + 5];

        const xScale = (index: number) => (index / (MAX_DATA_POINTS - 1)) * innerWidth;
        const yScale = (value: number) => innerHeight - ((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * innerHeight;

        const linePath = data
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.co2)}`)
            .join(' ');

        const tickCount = 5;
        const yAxisTicks = Array.from({ length: tickCount }, (_, i) => {
            const value = yDomain[0] + (i / (tickCount - 1)) * (yDomain[1] - yDomain[0]);
            return { value: Math.round(value), y: yScale(value) };
        });

        return { xScale, yScale, linePath, yAxisTicks };
    }, [data, innerWidth, innerHeight]);

    if (!data.length || !xScale || !yScale) return null;

    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} aria-label="Real-time CO2 emissions chart">
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Axes */}
                <line x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#d1d5db" />
                <line x1="0" y1="0" x2="0" y2={innerHeight} stroke="#d1d5db" />

                {/* Y-axis ticks and labels */}
                {yAxisTicks.map(tick => (
                    <g key={tick.value} transform={`translate(0, ${tick.y})`}>
                        <line x1="-5" y1="0" x2={innerWidth} y2="0" stroke="#f3f4f6" />
                        <text x="-10" y="0" dy="0.32em" textAnchor="end" fontSize="12" fill="#6b7280">
                            {tick.value}
                        </text>
                    </g>
                ))}

                {/* X-axis labels */}
                 <text x={0} y={innerHeight + 30} textAnchor="start" fontSize="12" fill="#6b7280">15 mins ago</text>
                 <text x={innerWidth} y={innerHeight + 30} textAnchor="end" fontSize="12" fill="#6b7280">Now</text>

                {/* Axis Titles */}
                <text transform={`rotate(-90)`} x={-innerHeight/2} y={-45} textAnchor="middle" fill="#1f2937" fontSize="14" fontWeight="bold">CO₂ (ppm)</text>
                
                {/* Line Path */}
                <path d={linePath} fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Most recent point */}
                <circle cx={xScale(data.length - 1)} cy={yScale(data[data.length - 1].co2)} r="5" fill="#15803d" />
            </g>
        </svg>
    );
};

const AirQualityChart: React.FC<AirQualityChartProps> = ({ onBack }) => {
    const [data, setData] = useState<CO2DataPoint[]>([]);
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('Initializing...');

    // 1. Get user's location
    useEffect(() => {
        setStatus('Requesting location access...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setError(null);
            },
            (err) => {
                setError('Location access denied. Please enable location services in your browser to use this feature.');
                setStatus('Location access denied.');
            }
        );
    }, []);

    // 2. Poll for data once location is available
    useEffect(() => {
        if (!location) return;

        const fetchData = async () => {
            try {
                setStatus(`Fetching CO2 data for your location...`);
                const newDataPoint = await getRealTimeCO2(location.lat, location.lon);
                setData(prevData => [...prevData.slice(prevData.length >= MAX_DATA_POINTS ? 1 : 0), newDataPoint]);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch air quality data.');
            }
        };

        fetchData(); // Initial fetch
        const intervalId = setInterval(fetchData, POLLING_INTERVAL);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [location]);

    const latestData = data.length > 0 ? data[data.length - 1] : null;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="text-brand-green hover:text-brand-dark-green mb-4">&larr; Back to Home</button>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fadeInUp">
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-brand-dark">Real-Time Local Air Quality</h2>
                    <p className="text-brand-gray mt-2">Live CO₂ emissions chart for your current location.</p>
                </div>

                {error && (
                    <div className="my-8 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                        <h3 className="font-bold">An Error Occurred</h3>
                        <p>{error}</p>
                    </div>
                )}
                
                {!error && (
                    <div className="mt-6">
                        {data.length === 0 ? (
                            <div className="text-center p-12">
                                <Spinner />
                                <p className="mt-4 text-lg text-brand-gray">{status}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="text-center mb-4">
                                    <p className="text-lg text-brand-gray">Latest Reading:</p>
                                    <p className="text-5xl font-extrabold text-brand-green my-1">{latestData?.co2.toFixed(1)} <span className="text-2xl font-semibold text-brand-gray">ppm</span></p>
                                    <p className="text-sm text-gray-400">{new Date(latestData?.timestamp || 0).toLocaleTimeString()}</p>
                                </div>
                                <Chart data={data} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AirQualityChart;

