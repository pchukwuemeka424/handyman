"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineGlobal } from "react-icons/ai";
import agentRegister from "@/actions/auth/registerAgent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    state: "",
    email: "",
    password: "",
    agentId: "",
  });

  const [prev, action, isPending] = useActionState(agentRegister, {});

  const statesInNigeria = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
    "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
    "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
    "Yobe", "Zamfara"
  ];

  const generateAgentId = (state) => {
    if (!state) return "";
    const prefix = state.substring(0, 3).toUpperCase();
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `${prefix}${randomNumber}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      if (name === "state") {
        updatedData.agentId = generateAgentId(value);
      }
      return updatedData;
    });
  };

  useEffect(() => {
    if (prev?.successMessage) {
      setMessage(prev.successMessage);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [prev?.successMessage, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-center mb-6">Register as an Agent</h2>
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        <form className="space-y-4" action={action}>
          <InputField type="text" name="fname" value={formData.fname} onChange={handleChange} icon={AiOutlineUser} placeholder="First Name" error={prev?.errors?.fname} />
          <InputField type="text" name="lname" value={formData.lname} onChange={handleChange} icon={AiOutlineUser} placeholder="Last Name" error={prev?.errors?.lname} />
          <SelectField name="state" value={formData.state} onChange={handleChange} options={statesInNigeria} error={prev?.errors?.state} />
          <InputField type="text" name="agentId" value={formData.agentId} icon={AiOutlineGlobal} placeholder="Agent ID" readOnly />
          <InputField type="email" name="email" value={formData.email} onChange={handleChange} icon={AiOutlineMail} placeholder="Email" error={prev?.errors?.email} />
          <InputField type="password" name="password" value={formData.password} onChange={handleChange} icon={AiOutlineLock} placeholder="Password" error={prev?.errors?.password} />
          <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all">
            {isPending ? "Registering..." : "Register"}
          </Button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account? <Link className="text-blue-700 hover:underline" href="/login">Login</Link>
          </p>
          {prev?.errors?.general && <p className="text-red-500 text-sm text-center mt-2">{prev.errors.general}</p>}
        </form>
      </div>
    </div>
  );
}

function InputField({ type, name, icon: Icon, placeholder, error, value, onChange, readOnly }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-3 pl-10 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white`}
      />
      <Icon className="absolute left-3 top-3 text-gray-400" size={20} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function SelectField({ name, value, onChange, options, error }) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 pl-10 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
      >
        <option value="">Select State</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
