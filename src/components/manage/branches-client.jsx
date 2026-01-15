"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AddBranchModal from "./modals/AddBranchModal";
import AddLocationModal from "./modals/AddLocationModal";
import AddBathroomModal from "./modals/AddBathroomModal";
import EditBranchModal from "./modals/EditBranchModal";
import EditLocationModal from "./modals/EditLocationModal";
import EditBathroomModal from "./modals/EditBathroomModal";

export default function BranchesClient({ initialBranches, tasks = [] }) {
    // Display States
    const [displayBranches, setDisplayBranches] = useState(initialBranches);
    const [displayLocations, setDisplayLocations] = useState([]);
    const [displayBathrooms, setDisplayBathrooms] = useState([]);

    // Selected Items
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Add Modal States
    const [openAddBranch, setOpenAddBranch] = useState(false);
    const [openAddLocation, setOpenAddLocation] = useState(false);
    const [openAddBathroom, setOpenAddBathroom] = useState(false);

    // Edit Modal States (stores the entity being edited)
    const [editingBranch, setEditingBranch] = useState(null);
    const [editingLocation, setEditingLocation] = useState(null);
    const [editingBathroom, setEditingBathroom] = useState(null);

    const handleSelectBranch = (branch) => {
        setSelectedBranch(branch);
        setSelectedLocation(null);
        setDisplayLocations(branch?.locations || []);
        setDisplayBathrooms([]);
    };

    const handleUnselect = () => {
        setSelectedBranch(null);
        setSelectedLocation(null);
        setDisplayLocations([]);
        setDisplayBathrooms([]);
    };

    const handleSelectLocation = (location) => {
        setSelectedLocation(location);
        setDisplayBathrooms(location?.bathrooms || []);
    };

    async function deleteBranch(branchId) {
        if (!window.confirm("Delete this branch?")) return;
        try {
            const res = await fetch(`/api/branches?branchId=${branchId}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Failed to delete branch");
                return;
            }
            setDisplayBranches((prev) => prev.filter((b) => b.branchId !== branchId));
            if (selectedBranch?.branchId === branchId) handleUnselect();
            setEditingBranch(null);
        } catch (err) {
            console.error(err);
            alert("Error deleting branch");
        }
    }

    async function deleteLocation(locationId) {
        if (!window.confirm("Delete this location?")) return;
        try {
            const res = await fetch(`/api/locations?locationId=${locationId}&branchId=${selectedBranch?.branchId}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Failed to delete location");
                return;
            }
            // Update displayLocations
            setDisplayLocations((prev) => prev.filter((l) => l.locationId !== locationId));
            // Also update displayBranches to keep the branch's locations array in sync
            setDisplayBranches((prev) =>
                prev.map((b) =>
                    b.branchId === selectedBranch?.branchId
                        ? { ...b, locations: b.locations.filter((l) => l.locationId !== locationId) }
                        : b
                )
            );
            // Update selectedBranch to keep it in sync
            setSelectedBranch((prev) =>
                prev ? { ...prev, locations: prev.locations.filter((l) => l.locationId !== locationId) } : prev
            );
            if (selectedLocation?.locationId === locationId) {
                setSelectedLocation(null);
                setDisplayBathrooms([]);
            }
            setEditingLocation(null);
        } catch (err) {
            console.error(err);
            alert("Error deleting location");
        }
    }

    async function deleteBathroom(bathroomId) {
        if (!window.confirm("Delete this bathroom?")) return;
        try {
            const res = await fetch(`/api/bathrooms?bathroomId=${bathroomId}&locationId=${selectedLocation?.locationId}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Failed to delete bathroom");
                return;
            }
            // Update displayBathrooms
            setDisplayBathrooms((prev) => prev.filter((b) => b.bathroomId !== bathroomId));
            // Update displayLocations to keep the location's bathrooms array in sync
            setDisplayLocations((prev) =>
                prev.map((l) =>
                    l.locationId === selectedLocation?.locationId
                        ? { ...l, bathrooms: l.bathrooms.filter((b) => b.bathroomId !== bathroomId) }
                        : l
                )
            );
            // Update selectedLocation to keep it in sync
            setSelectedLocation((prev) =>
                prev ? { ...prev, bathrooms: prev.bathrooms.filter((b) => b.bathroomId !== bathroomId) } : prev
            );
            // Update displayBranches to keep the branch's locations' bathrooms in sync
            setDisplayBranches((prev) =>
                prev.map((branch) =>
                    branch.branchId === selectedBranch?.branchId
                        ? {
                              ...branch,
                              locations: branch.locations.map((l) =>
                                  l.locationId === selectedLocation?.locationId
                                      ? { ...l, bathrooms: l.bathrooms.filter((b) => b.bathroomId !== bathroomId) }
                                      : l
                              ),
                          }
                        : branch
                )
            );
            setEditingBathroom(null);
        } catch (err) {
            console.error(err);
            alert("Error deleting bathroom");
        }
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden text-foreground">
            <div className="flex flex-col p-6 py-5 border-[6px] rounded-3xl border-brand min-h-screen overflow-hidden w-full">
                {/* Header */}
                <div className="w-full flex flex-row gap-5 items-center mb-5">
                    <Link
                        href="/"
                        className="h-10 w-10 flex items-center justify-center bg-foreground/10 rounded text-foreground hover:bg-foreground/20 transition"
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Link>
                    <div className="text-[30px] mr-auto">
                        <span className="text-foreground font-semibold">Manage Branches</span>
                    </div>
                    {selectedBranch && (
                        <button
                            onClick={handleUnselect}
                            className="bg-foreground/10 text-sm text-foreground px-5 py-2 rounded-full hover:bg-foreground/20"
                        >
                            Unselect
                        </button>
                    )}
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
                    {/* Column 1: Branches */}
                    <div className="flex flex-col gap-3 overflow-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide">
                                Branches
                            </h3>
                            <button
                                onClick={() => setOpenAddBranch(true)}
                                className="text-brand hover:text-brand/80"
                            >
                                <i className="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        <AnimatePresence>
                            {displayBranches.map((branch) => (
                                <motion.div
                                    key={branch.branchId}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onClick={() => handleSelectBranch(branch)}
                                    className={`p-4 rounded-xl cursor-pointer border transition-colors ${
                                        selectedBranch?.branchId === branch.branchId
                                            ? "border-brand bg-brand/10"
                                            : "border-foreground/20 bg-background hover:border-foreground/30 shadow-sm"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="text-foreground font-semibold">
                                                {branch.name}
                                            </div>
                                            <div className="text-xs text-foreground/50 mt-1">
                                                {branch.address || "No address"}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingBranch(branch);
                                                }}
                                                className="text-foreground/50 hover:text-brand p-1"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteBranch(branch.branchId);
                                                }}
                                                className="text-foreground/50 hover:text-red-400 p-1"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Column 2: Locations */}
                    <div className="flex flex-col gap-3 border-l border-foreground/10 pl-6 overflow-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide">
                                Locations
                            </h3>
                            {selectedBranch && (
                                <button
                                    onClick={() => setOpenAddLocation(true)}
                                    className="text-brand hover:text-brand/80"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                </button>
                            )}
                        </div>
                        {!selectedBranch ? (
                            <div className="text-foreground/40 text-sm text-center py-8">
                                Select a branch to view locations
                            </div>
                        ) : displayLocations.length === 0 ? (
                            <div className="text-foreground/40 text-sm text-center py-8">
                                No locations. Add one!
                            </div>
                        ) : (
                            <AnimatePresence>
                                {displayLocations.map((location) => (
                                    <motion.div
                                        key={location.locationId}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        onClick={() => handleSelectLocation(location)}
                                    className={`p-4 rounded-xl cursor-pointer border transition-colors ${
                                            selectedLocation?.locationId === location.locationId
                                                ? "border-brand bg-brand/10"
                                            : "border-foreground/20 bg-background shadow-sm hover:border-foreground/30"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                            <div className="text-foreground font-semibold">
                                                    {location.locationName}
                                                </div>
                                            <div className="text-xs text-foreground/50 mt-1">
                                                    {location.locationDescription || "No description"}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingLocation(location);
                                                    }}
                                                className="text-foreground/50 hover:text-brand p-1"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteLocation(location.locationId);
                                                    }}
                                                className="text-foreground/50 hover:text-red-400 p-1"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Column 3: Bathrooms */}
                    <div className="flex flex-col gap-3 border-l border-foreground/10 pl-6 overflow-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide">
                                Bathrooms
                            </h3>
                            {selectedLocation && (
                                <button
                                    onClick={() => setOpenAddBathroom(true)}
                                    className="text-brand hover:text-brand/80"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                </button>
                            )}
                        </div>
                        {!selectedLocation ? (
                            <div className="text-foreground/40 text-sm text-center py-8">
                                Select a location to view bathrooms
                            </div>
                        ) : displayBathrooms.length === 0 ? (
                            <div className="text-foreground/40 text-sm text-center py-8">
                                No bathrooms. Add one!
                            </div>
                        ) : (
                            <AnimatePresence>
                                {displayBathrooms
                                    .slice()
                                    .sort((a, b) => a.order - b.order)
                                    .map((bathroom) => (
                                        <motion.div
                                            key={bathroom.bathroomId}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                        className="p-4 rounded-xl border border-foreground/20 bg-background shadow-sm"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/20">
                                                        {bathroom.gender === "Female" ? (
                                                        <i className="bi bi-person-standing-dress text-foreground"></i>
                                                        ) : bathroom.gender === "Neutral" ? (
                                                            <>
                                                            <i className="bi bi-person-standing text-foreground text-xs"></i>
                                                            <i className="bi bi-person-standing-dress text-foreground text-xs"></i>
                                                            </>
                                                        ) : (
                                                        <i className="bi bi-person-standing text-foreground"></i>
                                                        )}
                                                    </div>
                                                    <div>
                                                    <div className="text-foreground font-semibold">
                                                            {bathroom.name}
                                                        </div>
                                                    <div className="text-xs text-foreground/50">
                                                            {bathroom.gender} • Order: {bathroom.order}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => setEditingBathroom(bathroom)}
                                                    className="text-foreground/50 hover:text-brand p-1"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteBathroom(bathroom.bathroomId)}
                                                    className="text-foreground/50 hover:text-red-400 p-1"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Modals */}
            <AnimatePresence>
                {openAddBranch && (
                    <AddBranchModal
                        openAddBranch={openAddBranch}
                        setOpenAddBranch={setOpenAddBranch}
                        setDisplayBranches={setDisplayBranches}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {openAddLocation && selectedBranch && (
                    <AddLocationModal
                        branchId={selectedBranch.branchId}
                        openAddLocation={openAddLocation}
                        setOpenAddLocation={setOpenAddLocation}
                        setDisplayLocations={setDisplayLocations}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {openAddBathroom && selectedLocation && (
                    <AddBathroomModal
                        locationId={selectedLocation.locationId}
                        openAddBathroom={openAddBathroom}
                        setOpenAddBathroom={setOpenAddBathroom}
                        setDisplayBathrooms={setDisplayBathrooms}
                        tasks={tasks}
                        displayBathrooms={displayBathrooms}
                    />
                )}
            </AnimatePresence>

            {/* Edit Modals */}
            <AnimatePresence>
                {editingBranch && (
                    <EditBranchModal
                        branch={editingBranch}
                        openEditBranch={!!editingBranch}
                        setOpenEditBranch={setEditingBranch}
                        setDisplayBranches={setDisplayBranches}
                        onDelete={deleteBranch}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingLocation && selectedBranch && (
                    <EditLocationModal
                        location={editingLocation}
                        branchId={selectedBranch.branchId}
                        openEditLocation={!!editingLocation}
                        setOpenEditLocation={setEditingLocation}
                        setDisplayLocations={setDisplayLocations}
                        onDelete={deleteLocation}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingBathroom && selectedLocation && (
                    <EditBathroomModal
                        bathroom={editingBathroom}
                        locationId={selectedLocation.locationId}
                        openEditBathroom={!!editingBathroom}
                        setOpenEditBathroom={setEditingBathroom}
                        setDisplayBathrooms={setDisplayBathrooms}
                        tasks={tasks}
                        onDelete={deleteBathroom}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
