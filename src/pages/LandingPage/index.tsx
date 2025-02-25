import { useState } from "react";
import BannersTabs from "./tabs/BannersTabs";
import PlansTab from "./tabs/PlansTab";
import ContactsTab from "./tabs/ContactsTab";
import ServicesTab from "./tabs/ServicesTab";
import RatingTab from "./tabs/RatingTab";
import { useAuth } from "@/context/AuthContext";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


type TTabs = "Planos" | "Banners" | "Contatos" | "Servicos" | "Avaliacao";

const tabs: Array<TTabs> = ["Planos", "Banners", "Contatos", "Servicos", "Avaliacao"];


const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<TTabs>("Planos");

    const { logout } = useAuth();

    return (
        <>
            <SidebarProvider>
                <Sidebar variant="floating">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Paginas</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {tabs.map((item, index) => (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton onClick={() => setActiveTab(item)} className="cursor-pointer" asChild isActive={activeTab === item}>
                                                <span className={`hover:text-white ${activeTab === item ? 'text-white' : ''}`}>{item}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild className="hover:bg-red-400 active:bg-red-400" onClick={() => logout()}>
                                            <a className="bg-red-400 cursor-pointer" >
                                                <span className="text-white">Sair</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <SidebarTrigger />
                <main className="w-full">
                    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
                        <div className="w-full max-w-full sm:max-w-4xl bg-white rounded-2xl p-6 shadow-md">

                            {
                                activeTab === "Banners" ? (
                                    <BannersTabs />
                                ) : activeTab === "Planos" ? (
                                    <PlansTab />
                                ) : activeTab === "Contatos" ? (
                                    <ContactsTab />
                                ) : activeTab === "Servicos" ? (
                                    <ServicesTab />
                                ) : <RatingTab />
                            }

                        </div>
                    </div>
                </main>
            </SidebarProvider>
        </>
    );
};

export default LandingPage;
