"use client"; // This tells Next.js to treat this component as a client-side component

import React, { useState } from "react";
import { useActionState } from "react"; // Ensure this is a valid import or replace with a correct hook
import { FaStore, FaUser, FaAddressCard, FaPhone, FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";

export default function ProfileForm({ handler, defaultValues }) {
  const [state, action, isPending] = useActionState(handler, undefined);
  const states = [
    { name: "Abia", lgas: ["Aba North", "Aba South", "Isiala Ngwa North", "Isiala Ngwa South", "Obingwa", "Ugwunagbo", "Umuahia North", "Umuahia South", "Umu Nneochi"] },
    { name: "Adamawa", lgas: ["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"] },
    { name: "Akwa Ibom", lgas: ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Ibesikpo Asutan", "Ibiono Ibom", "Ika", "Ikono", "Ikot Abasi", "Uyo", "Ini", "Itu", "Mbo", "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", "Oron", "Oruk Anam", "Ukanafun", "Uruan"] },
    { name: "Anambra", lgas: ["Aguata", "Awka North", "Awka South", "Anaocha", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"] },
    { name: "Bauchi", lgas: ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Zaki"] },
    { name: "Bayelsa", lgas: ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"] },
    { name: "Benue", lgas: ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Ortom", "Tarka", "Ukum", "Ushongo", "Vandeikya"] },
    { name: "Borno", lgas: ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Gwoza", "Jere", "Kaga", "Kala/Balge", "Konduga", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"] },
    { name: "Cross River", lgas: ["Akpabuyo", "Bakassi", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Eket", "Ikom", "Obanliku", "Obubra", "Odukpani", "Ogoja", "Yakuur"] },
    { name: "Delta", lgas: ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North-East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"] },
    { name: "Ebonyi", lgas: ["Abakaliki", "Afikpo North", "Afikpo South", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"] },
    { name: "Edo", lgas: ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba-Okha", "Oredo", "Orhionmwon", "Ovia North-East", "Ovia South-West", "Uhunmwonde"] },
    { name: "Ekiti", lgas: ["Ado-Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Ido/Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Oye"] },
    { name: "Enugu", lgas: ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo-Etiti", "Igboeze North", "Igboeze South", "Isi-Uzo", "Nkanu East", "Nkanu West", "Oji River", "Udenu", "Udi", "Uzo-Uwani"] },
    { name: "Gombe", lgas: ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"] },
    { name: "Imo", lgas: ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor-Okpala", "Njaba", "Nwangele", "Nkwerre", "Obowo", "Oguta", "Ohaji/Egbema", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"] },
    { name: "Jigawa", lgas: ["Auyo", "Babura", "Birnin Kudu", "Buji", "Dutse", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"] },
    { name: "Kaduna", lgas: ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"] },
    { name: "Kano", lgas: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Tarauni", "Tofa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"] },
    { name: "Katsina", lgas: ["Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dutsinma", "Funtua", "Jibia", "Kaita", "Kankara", "Katsina", "Kurfi", "Mai'adua", "Malumfashi", "Mashi", "Musawa", "Rimi", "Sabuwa", "Safana", "Zango"] },
    { name: "Kebbi", lgas: ["Aleiro", "Arewa", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Danko/Wasagu", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"] },
    { name: "Kogi", lgas: ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela-Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa-Muro", "Ofu", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"] },
    { name: "Kwara", lgas: ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"] },
    { name: "Lagos", lgas: ["Agege", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Balogun", "Bariga", "Epe", "Eti-Osa", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"] },
    { name: "Nasarawa", lgas: ["Akwanga", "Doma", "Karu", "Keana", "Kokona", "Lafia", "Nasarawa", "Niger", "Obi", "Toto"] },
    { name: "Niger", lgas: ["Agwara", "Bida", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Mokwa", "Mashegu", "Munya", "Paikoro", "Rafi", "Raymond", "Shiroro", "Tafa"] },
    { name: "Ogun", lgas: ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egba", "Ewekoro", "Ifo", "Ijebu North", "Ijebu East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi-Owode", "Odeda", "Ogun Waterside", "Ota", "Remo North", "Shagamu"] },
    { name: "Ondo", lgas: ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese-Odo", "Idanre", "Ifedore", "Ilaje", "Ile-Oluji/Okeigbo", "Irele", "Odigbo", "Ose", "Owo"] },
    { name: "Osun", lgas: ["Aiyedire", "Atakumosa East", "Atakumosa West", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ekiti", "Ife Central", "Ife East", "Ife North", "Ife South", "Ilesha East", "Ilesha West", "Isokan", "Iwo", "Obokun", "Olorunda", "Oriade", "Orolu", "Osogbo"] },
    { name: "Oyo", lgas: ["Akinyele", "Atiba", "Atigbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Iseyin", "Iskande", "Kajola", "Lagelu", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Oriire", "Surulere"] },
    { name: "Plateau", lgas: ["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"] },
    { name: "Rivers", lgas: ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Emohua", "Etche", "Ikwerre", "Khana", "Obio-Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Omuma", "Opobo/Nkoro", "Port Harcourt", "Tai"] },
    { name: "Sokoto", lgas: ["Binji", "Bodinga", "Dange/Shuni", "Gada", "Goronyo", "Gudu", "Illela", "Kebbe", "Kware", "Rabah", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tureta", "Wamako", "Wurno", "Yabo"] },
    { name: "Taraba", lgas: ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau", "Muri", "Sardauna", "Takum", "Ussa", "Wukari", "Zing"] },
    { name: "Yobe", lgas: ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari"] },
    { name: "Zamfara", lgas: ["Anka", "Bakura", "Birnin Magaji", "Bukkuyum", "Chafe", "Gummi", "Gusau", "Iliya", "Maradun", "Maro", "Shinkafi", "Talata-Mafara", "Zumi"] }
  ];
  

  const [selectedState, setSelectedState] = useState('');
  const [lga, setLga] = useState('');
  
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);
    setLga(''); // Reset LGA when state changes
  };

  const handleLgaChange = (e) => {
    setLga(e.target.value);
  };

  const stateLgas = states.find(s => s.name === selectedState)?.lgas || [];

  return (
    <div className="w-full sm:w-2/4">
      <form className="space-y-4 w-full" action={action}>
        {/* Store Name */}
        <div className="flex items-center">
          <FaStore className="mr-2 text-gray-500" />
          <input
            type="text"
            name="shopname"
            placeholder="Enter store name"
            aria-label="Store Name"
            className="w-full px-4 py-2 border rounded-lg"
            defaultValue={state?.shopname || defaultValues?.shopname}
          />
          {state?.errors?.shopname && (
            <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.shopname}</p>
          )}
        </div>

        {/* Username */}
        <div className="flex items-center">
          <FaUser className="mr-2 text-gray-500" />
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            aria-label="Username"
            className="w-full px-4 py-2 border rounded-lg"
            defaultValue={state?.username || defaultValues?.username}
          />
          {state?.errors?.username && (
            <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.username}</p>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start">
          <FaAddressCard className="mr-2 text-gray-500 mt-2" />
          <textarea
            name="address"
            placeholder="Enter your address"
            aria-label="Address"
            className="w-full px-4 py-2 border rounded-lg"
            rows="3"
            defaultValue={state?.address || defaultValues?.address}
          ></textarea>
          {state?.errors?.address && (
            <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.address}</p>
          )}
        </div>

        {/* State and LGA */}
        <div className="flex flex-col md:flex-row gap-4">
  <div className="flex items-center w-full">
    <select
      name="stat"
      value={selectedState || ''}
      onChange={handleStateChange}
      className="w-full px-4 py-2 border rounded-lg"
    >
            <option value="" disabled>{state?.stat || defaultValues?.stat}</option>
      {states.map((stateOption) => (
        <option key={stateOption.name} value={stateOption.name}>
          {stateOption.name}
        </option>
      ))}
    </select>
    {state?.errors?.stat && (
      <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.stat}</p>
    )}
  </div>

  <div className="flex items-center w-full">
    <select
      name="city"
      value={lga || ''}
      onChange={handleLgaChange}
      className="w-full px-4 py-2 border rounded-lg"
      disabled={!selectedState}
    >
      <option value="" disabled>{state?.city || defaultValues?.city}</option>
      {stateLgas?.map((lgaOption) => (
        <option key={lgaOption} value={lgaOption}>
          {lgaOption}
        </option>
      ))}
    </select>
    {state?.errors?.city && (
      <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.city}</p>
    )}
  </div>
</div>



        {/* Mobile */}
        <div className="flex items-center">
          <FaPhone className="mr-2 text-gray-500" />
          <input
            type="text"
            name="phone"
            placeholder="Enter mobile number"
            aria-label="Mobile Number"
            className="w-full px-4 py-2 border rounded-lg"
            defaultValue={state?.phone || defaultValues?.phone}
          />
          {state?.errors?.phone && (
            <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.phone}</p>
          )}
        </div>

        {/* Social Media URLs */}
        <div className="flex items-start">
          <FaFacebook className="mr-2 text-gray-500 mt-2" />
          <input 
            type="text"
            name="facebook"
            placeholder="Enter Facebook URL"
            aria-label="Facebook URL"
            className="w-full px-4 py-2 border rounded-lg"
            defaultValue={state?.facebook || defaultValues?.facebook}
          />
          {state?.errors?.facebook && (
            <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.facebook}</p>
          )}
        </div>
        <div className="flex items-start">
          <FaInstagram className="mr-2 text-gray-500 mt-2" />
          <input 
            type="text"
            name="instagram"
            placeholder="Enter Instagram URL"
            aria-label="Instagram URL"
            className="w-full px-4 py-2 border rounded-lg"
            defaultValue={state?.instagram || defaultValues?.instagram}
          />
          {state?.errors?.instagram && (
            <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.instagram}</p>
          )}
        </div>
        <div className="flex items-start">
          <FaTwitter className="mr-2 text-gray-500 mt-2" />
          <input  
            type="text"
            name="twitter"
            placeholder="Enter Twitter URL" 
            aria-label="Twitter URL"
            className="w-full px-4 py-2 border rounded-lg"
            defaultValue={state?.twitter || defaultValues?.twitter}
          />
          {state?.errors?.twitter && (
            <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.twitter}</p>
          )}
        </div>

        {/* About Us */}
        <div className="flex items-start">
          <textarea
            name="about"
            placeholder="Tell us about your store"
            aria-label="About Us"
            className="w-full px-4 py-2 border rounded-lg"
            rows="4"
            defaultValue={state?.about || defaultValues?.about}
          ></textarea>
          {state?.errors?.about && (
            <p className="text-red-500 text-sm mt-1 ml-8">{state.errors.about}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
