import React, { useState } from 'react'
import { states } from './stateLga'

export default function selectedState() {
    const [selectedState, setSelectedState] = useState('');
    const [lga, setLga] = useState('');
    const stateLgas = states.find((s) => s.name === selectedState)?.lgas || [];
    const [formData, setFormData] = useState({
        state: '',
        city: '',
    });

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
        setLga(''); // Reset LGA when state changes
    };

    const handleLgaChange = (e) => {
        setLga(e.target.value);
        setFormData((prevData) => ({ ...prevData, city: e.target.value }));
    };

    return (
        <div>

            <div className="my-2 grid grid-cols-2 gap-4">
                <div>
                  
                    <select
                        name="state"
                        id="state"
                        value={selectedState}
                        onChange={handleStateChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state.name} value={state.name}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                  
                    <select
                        name="city"
                        id="city"
                        value={lga}
                        onChange={handleLgaChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select LGA</option>
                        {stateLgas.map((lga) => (
                            <option key={lga} value={lga}>
                                {lga}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
