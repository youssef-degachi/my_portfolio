"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaPhoneAlt, FaEnvelope, FaMapMarkedAlt, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const info = [
  {
    icon: <FaPhoneAlt/>,
    title: "Phone",
    description: "(+216) 50 702 320"
  },
  {
    icon: <FaEnvelope/>,
    title: "Email",
    description: "youssefdegachi0@gmail.com"
  },
  {
    icon: <FaLinkedin/>,
    title: "LinkedIn",
    description: "Youssef Degachi"
  },
]

const Contact = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  // State to store errors
  const [errors, setErrors] = useState({});

  // State for success message
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors as user types
  };

  // Validate inputs
  const validateForm = () => {
    let validationErrors = {};
    if (!formData.firstname) validationErrors.firstname = "Firstname is required.";
    if (!formData.lastname) validationErrors.lastname = "Lastname is required.";
    if (!formData.email) {
      validationErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email format is invalid.";
    }
    if (!formData.phone) validationErrors.phone = "Phone number is required.";
    if (!formData.service) validationErrors.service = "Please select a service.";
    if (!formData.message) validationErrors.message = "Message cannot be empty.";
    return validationErrors;
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
  } else {
    try {
      const response = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      console.log("API Response:", response); // Log the respons

      if (response.ok) {
        setSuccess("Your message has been sent successfully!");
        setFormData({ firstname: "", lastname: "", email: "", phone: "", service: "", message: "" }); // Clear form
      } else {
        const result = await response.json();
        console.error("Error Response:", result); // Log the error response
        setErrors({ general: result.message || "Failed to send message." });
      }
    } catch (error) {
      console.error("Fetch Error:", error); // Log fetch error
      setErrors({ general: "There was an error sending your message. Please try again later." });
    }
  }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.4, ease: "easeIn" } }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          {/* form */}
          <div className="xl:h-[54%] order-2 xl:order-none">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl">
              <h3 className="text-accent-default text-4xl">Let's work together</h3>
              <p className="text-white/60">Let's make your dream come true.</p>
              {/* input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="firstname" type="text" placeholder="Firstname" value={formData.firstname} onChange={handleChange} />
                {errors.firstname && <span className="text-red-500">{errors.firstname}</span>}

                <Input name="lastname" type="text" placeholder="Lastname" value={formData.lastname} onChange={handleChange} />
                {errors.lastname && <span className="text-red-500">{errors.lastname}</span>}

                <Input name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="text-red-500">{errors.email}</span>}

                <Input name="phone" type="text" placeholder="Phone number" value={formData.phone} onChange={handleChange} />
                {errors.phone && <span className="text-red-500">{errors.phone}</span>}
              </div>

              {/* select */}
              <Select name="service" value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select a service</SelectLabel>
                    <SelectItem value="webdev">Web Development</SelectItem>
                    <SelectItem value="uiux">UI/UX Design</SelectItem>
                    <SelectItem value="logo">Logo Design</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.service && <span className="text-red-500">{errors.service}</span>}

              {/* textarea */}
              <Textarea
                name="message"
                className="h-[200px]"
                placeholder="Type your message here."
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <span className="text-red-500">{errors.message}</span>}

              {/* btn */}
              <Button type="submit" size="md" className="max-w-40 h-10">
                Send message
              </Button>

              {errors.general && <p className="text-red-500">{errors.general}</p>}
              {success && <p className="text-green-500">{success}</p>}
            </form>
          </div>
          {/* info */}
          <div className="flex-1 flex items-center xl:justify-center order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => (
                <li key={index} className="flex items-center gap-6">
                  <div className="w-[52px] h-[52px] xl:w-[72px] bg-[#27272c] text-accent-default rounded-md flex items-center justify-center">
                    <div className="text-[28px]">{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60">{item.title}</p>
                    <h3 className="text-xl">{item.description}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
