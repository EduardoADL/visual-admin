import { useState } from "react";
import BannersTabs from "./tabs/BannersTabs";
import PlansTab from "./tabs/PlansTab";
import ContactsTab from "./tabs/ContactsTab";
import ServicesTab from "./tabs/ServicesTab";

type TTabs = "Planos" | "Banners" | "Contatos" | "Serviços";

const tabs: Array<TTabs> = ["Planos", "Banners", "Contatos", "Serviços"];

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<TTabs>("Planos");

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
                <div className="w-full max-w-full sm:max-w-4xl bg-white rounded-2xl p-6 shadow-md">
                    <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 text-center mb-4">
                        Gerenciamento de Conteúdo
                    </h2>

                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    {
                        activeTab === "Banners" ? (
                            <BannersTabs />
                        ) : activeTab === "Planos" ? (
                            <PlansTab />
                        ) : activeTab === "Contatos" ? (
                            <ContactsTab />
                        ) : <ServicesTab />
                    }

                </div>
            </div>
        </>
    );
};

export default LandingPage;
