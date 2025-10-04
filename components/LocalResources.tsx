/// <reference types="vite/client" />

import React, { useState, useEffect, useRef } from 'react';
import { findLocalResources } from '../services/geminiService';
import type { LocalResourcesResult, LocalResource } from '../types';
import Spinner from './Spinner';

interface LocalResourcesProps {
  onBack: () => void;
}

type ResourceCategory = 'recyclingCenters' | 'thriftStores' | 'farmersMarkets';

const markerIcons = {
  recyclingCenters: { path: 'M12 6v3l4-4-4-4v3...', fillColor: '#15803d' },
  thriftStores: { path: 'M20 4H4v2h16V4...', fillColor: '#ca8a04' },
  farmersMarkets: { path: 'M17.21 9l-4.38-6.56...', fillColor: '#c2410c' }
};

const loadGoogleMapsScript = (apiKey: string) =>
  new Promise<void>((resolve, reject) => {
    if ((window as any).google?.maps) return resolve();
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    (window as any).initMap = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps.'));
    document.head.appendChild(script);
  });

const LocalResources: React.FC<LocalResourcesProps> = ({ onBack }) => {
  const [locationInput, setLocationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<LocalResourcesResult | null>(null);
  const [activeTab, setActiveTab] = useState<ResourceCategory>('recyclingCenters');
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  const mapsApiKey = import.meta.env.VITE_MAP_API_KEY;

  // Load Google Maps
  useEffect(() => {
    if (!mapsApiKey) {
      setError('Google Maps API key missing');
      return;
    }

    let isMounted = true;
    loadGoogleMapsScript(mapsApiKey)
      .then(() => {
        if (!isMounted) return;
        if (!mapRef.current) return;
        if (!(window as any).google?.maps) {
          setError('Google Maps did not load correctly.');
          return;
        }

        mapInstanceRef.current = new (window as any).google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          mapTypeControl: false,
          streetViewControl: false,
        });
        infoWindowRef.current = new (window as any).google.maps.InfoWindow();
        setMapLoaded(true);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [mapsApiKey]);

  // Update markers whenever resources change
  useEffect(() => {
    if (!resources || !mapLoaded || !mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new (window as any).google.maps.LatLngBounds();

    const addMarkers = (data: LocalResource[], category: ResourceCategory) => {
      data.forEach(item => {
        if (!item.latitude || !item.longitude) return;

        const marker = new (window as any).google.maps.Marker({
          position: { lat: item.latitude, lng: item.longitude },
          map: mapInstanceRef.current,
          title: item.name,
          icon: {
            path: markerIcons[category].path,
            fillColor: markerIcons[category].fillColor,
            fillOpacity: 1,
            anchor: new (window as any).google.maps.Point(12, 12),
            strokeWeight: 0,
            scale: 1.5,
          },
        });

        marker.addListener('click', () => {
          infoWindowRef.current.setContent(`
            <div style="font-family:sans-serif;color:#1f2937;">
              <h4 style="font-weight:bold">${item.name}</h4>
              <p style="font-size:0.85rem;color:#6b7280;">${item.address}</p>
              <p>${item.description}</p>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
        bounds.extend({ lat: item.latitude, lng: item.longitude });
      });
    };

    addMarkers(resources.recyclingCenters, 'recyclingCenters');
    addMarkers(resources.thriftStores, 'thriftStores');
    addMarkers(resources.farmersMarkets, 'farmersMarkets');

    if (markersRef.current.length > 0) {
      mapInstanceRef.current.fitBounds(bounds);
      if (markersRef.current.length === 1) mapInstanceRef.current.setZoom(14);
    }
  }, [resources, mapLoaded]);

const fetchResources = async (location: string) => {
    setIsLoading(true);
    setError(null);
    setResources(null);
  
    try {
      const result = await findLocalResources(location);
      console.log('API result:', result); // <-- see exactly what the API returns
  
      // Check if the API returned expected keys
      const hasValidData =
        result &&
        (result.recyclingCenters?.length > 0 ||
          result.thriftStores?.length > 0 ||
          result.farmersMarkets?.length > 0);
  
      if (hasValidData) {
        setResources(result);
      } else {
        console.warn('API returned empty or malformed data, falling back to mock.');
        // Fallback mock data
        const mockResult: LocalResourcesResult = {
          recyclingCenters: [
            { name: 'Recycling Center 1', address: '123 Green St', description: 'Accepts plastic, glass, paper', latitude: 40.7128, longitude: -74.0060 },
          ],
          thriftStores: [
            { name: 'Thrift Store 1', address: '456 Vintage Ave', description: 'Clothes and furniture', latitude: 40.7138, longitude: -74.0050 },
          ],
          farmersMarkets: [
            { name: 'Farmers Market 1', address: '789 Fresh Ln', description: 'Local produce', latitude: 40.7148, longitude: -74.0040 },
          ],
        };
        setResources(mockResult);
      }
    } catch (err: any) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Unknown error fetching resources.');
  
      // Optional: fallback mock data even on fetch failure
      const mockResult: LocalResourcesResult = {
        recyclingCenters: [
          { name: 'Recycling Center 1', address: '123 Green St', description: 'Accepts plastic, glass, paper', latitude: 40.7128, longitude: -74.0060 },
        ],
        thriftStores: [
          { name: 'Thrift Store 1', address: '456 Vintage Ave', description: 'Clothes and furniture', latitude: 40.7138, longitude: -74.0050 },
        ],
        farmersMarkets: [
          { name: 'Farmers Market 1', address: '789 Fresh Ln', description: 'Local produce', latitude: 40.7148, longitude: -74.0040 },
        ],
      };
      setResources(mockResult);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) return setError('Please enter a location.');
    fetchResources(locationInput);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return setError('Geolocation not supported.');
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setLocationInput(`Current location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
          mapInstanceRef.current.setZoom(13);
        }
        fetchResources(`${latitude},${longitude}`);
      },
      () => {
        setError('Unable to retrieve location.');
        setIsLoading(false);
      }
    );
  };

  const renderResourceList = (data: LocalResource[] | undefined) => {
    if (!data || data.length === 0) {
      return <p className="text-gray-600 mt-4 text-center">No resources found in this category.</p>;
    }
    return (
      <ul className="space-y-4">
        {data.map((item, index) => (
          <li key={index} className="bg-white p-4 rounded shadow border">
            <h4 className="font-bold text-lg">{item.name}</h4>
            <p className="text-sm text-gray-500">{item.address}</p>
            <p className="mt-1">{item.description}</p>
          </li>
        ))}
      </ul>
    );
  };

  const tabs: { key: ResourceCategory; label: string }[] = [
    { key: 'recyclingCenters', label: 'Recycling' },
    { key: 'thriftStores', label: 'Thrift Stores' },
    { key: 'farmersMarkets', label: 'Farmer\'s Markets' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="text-green-600 mb-4">&larr; Back to Home</button>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={locationInput}
          onChange={e => setLocationInput(e.target.value)}
          placeholder="Enter city, state, or zip"
          className="border p-2 flex-grow"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">Search</button>
        <button type="button" onClick={handleGeolocation} className="bg-gray-300 px-4 py-2">
          Use Current Location
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!mapLoaded && !error && <div>Loading Google Map...</div>}
      <div ref={mapRef} className="h-96 w-full rounded-lg shadow-md bg-gray-200 mb-4" />

      {isLoading && <Spinner />}

      {resources && !isLoading && (
        <>
          <div className="border-b mb-4">
            <nav className="-mb-px flex space-x-4">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-3 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-green-600 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({resources[tab.key]?.length ?? 0})
                </button>
              ))}
            </nav>
          </div>

          {renderResourceList(resources[activeTab])}
        </>
      )}
    </div>
  );
};

export default LocalResources;
