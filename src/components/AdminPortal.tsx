import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  Search, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Plus, 
  RefreshCw, 
  ArrowLeft, 
  TrendingUp, 
  CalendarCheck, 
  Clock3, 
  XOctagon, 
  PlusCircle, 
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, deleteDoc, getDocs, updateDoc, setDoc } from 'firebase/firestore';

interface AppointmentBooking {
  firestoreId?: string;
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AdminPortalProps {
  onClose: () => void;
}

export default function AdminPortal({ onClose }: AdminPortalProps) {
  const { user } = useAuth();
  const isAdmin = user?.email === 'official.agentraai@gmail.com';

  // State
  const [bookings, setBookings] = useState<AppointmentBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'created-desc'>('created-desc');

  // New Booking form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newService, setNewService] = useState('blowout');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Booking Modal
  const [editingBooking, setEditingBooking] = useState<AppointmentBooking | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editService, setEditService] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editStatus, setEditStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all bookings
  const fetchAllBookings = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const allData: AppointmentBooking[] = [];
      querySnapshot.forEach((docSnap) => {
        allData.push({ 
          ...docSnap.data() as AppointmentBooking, 
          firestoreId: docSnap.id 
        });
      });
      setBookings(allData);
      localStorage.setItem('all_bookings_cache', JSON.stringify(allData));
    } catch (err: any) {
      console.warn('Admin fetch error. Falling back to local offline cache:', err);
      const cached = localStorage.getItem('all_bookings_cache');
      if (cached) {
        setBookings(JSON.parse(cached));
        setErrorMsg('Operating in offline fallback mode. Bookings are loaded from local cache.');
      } else {
        try {
          handleFirestoreError(err, OperationType.LIST, 'bookings');
        } catch (logErr) {
          setErrorMsg('Failed to fetch from server. Please add a new reservation below to initialize offline cache.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllBookings();
    }
  }, [isAdmin]);

  // Manage Status change instantly
  const handleUpdateStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'pending') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const bRef = doc(db, 'bookings', bookingId);
      const existing = bookings.find(b => b.id === bookingId);
      if (!existing) return;

      const updated = {
        ...existing,
        status: status
      };

      try {
        await setDoc(bRef, updated);
      } catch (fErr) {
        console.warn('Could not sync status update to Cloud Firestore. Saved locally.', fErr);
      }

      setSuccessMsg(`Booking status set to "${status}" successfully. (Local Cache Synchronized)`);
      // Update local state and local storage cache
      const updatedList = bookings.map(b => b.id === bookingId ? updated : b);
      setBookings(updatedList);
      localStorage.setItem('all_bookings_cache', JSON.stringify(updatedList));
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Update status error:', err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
      } catch (logErr) {
        setErrorMsg('Failed to update booking status.');
      }
    }
  };

  // Delete booking
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
      } catch (fErr) {
        console.warn('Could not sync booking deletion to Cloud Firestore. Removed locally.', fErr);
      }

      setSuccessMsg('Booking deleted successfully. (Local Cache Synchronized)');
      const updatedList = bookings.filter(b => b.id !== bookingId);
      setBookings(updatedList);
      localStorage.setItem('all_bookings_cache', JSON.stringify(updatedList));
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Delete booking error:', err);
      try {
        handleFirestoreError(err, OperationType.DELETE, `bookings/${bookingId}`);
      } catch (logErr) {
        setErrorMsg('Unauthorized or failed to delete this booking.');
      }
    }
  };

  // Create booking
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const bookingId = `book_${Date.now()}`;
    const newBooking: AppointmentBooking = {
      id: bookingId,
      userId: `guest_admin_${Date.now()}`,
      name: newName,
      phone: newPhone,
      email: newEmail,
      service: newService,
      date: newDate,
      time: newTime,
      notes: newNotes,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    try {
      try {
        await setDoc(doc(db, 'bookings', bookingId), newBooking);
      } catch (fErr) {
        console.warn('Could not sync new booking to Cloud Firestore. Saved locally.', fErr);
      }

      const updatedList = [newBooking, ...bookings];
      setBookings(updatedList);
      localStorage.setItem('all_bookings_cache', JSON.stringify(updatedList));

      setSuccessMsg('New reservation added successfully from Admin end! (Local Cache Synchronized)');
      setShowAddForm(false);
      // Reset form
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewService('blowout');
      setNewDate('');
      setNewTime('10:00 AM');
      setNewNotes('');
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      console.error('Admin create booking error:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
      } catch (logErr) {
         setErrorMsg('Failed to submit new booking.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (booking: AppointmentBooking) => {
    setEditingBooking(booking);
    setEditName(booking.name);
    setEditPhone(booking.phone);
    setEditEmail(booking.email);
    setEditService(booking.service);
    setEditDate(booking.date);
    setEditTime(booking.time);
    setEditStatus(booking.status);
    setEditNotes(booking.notes || '');
  };

  // Save edited booking
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking || !isAdmin) return;
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const updatedBooking: AppointmentBooking = {
      ...editingBooking,
      name: editName,
      phone: editPhone,
      email: editEmail,
      service: editService,
      date: editDate,
      time: editTime,
      status: editStatus,
      notes: editNotes,
    };

    try {
      try {
        await setDoc(doc(db, 'bookings', editingBooking.id), updatedBooking);
      } catch (fErr) {
        console.warn('Could not sync booking edit to Cloud Firestore. Saved locally.', fErr);
      }

      const updatedList = bookings.map(b => b.id === editingBooking.id ? updatedBooking : b);
      setBookings(updatedList);
      localStorage.setItem('all_bookings_cache', JSON.stringify(updatedList));

      setSuccessMsg(`Booking ID ${editingBooking.id} updated successfully. (Local Cache Synchronized)`);
      setEditingBooking(null);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Admin save edit error:', err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${editingBooking.id}`);
      } catch (logErr) {
        setErrorMsg('Failed to update the booking changes.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Export current list to CSV
  const exportToCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['ID', 'Customer Name', 'Phone', 'Email', 'Service', 'Date', 'Time', 'Created At', 'Status', 'Notes'];
    const rows = filteredBookings.map(b => [
      b.id,
      b.name,
      b.phone,
      b.email,
      b.service,
      b.date,
      b.time,
      b.createdAt,
      b.status,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodeUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodeUri);
    link.setAttribute('download', `Dolores_Salon_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters application
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.notes && b.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesService = serviceFilter === 'all' || b.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Sorting application
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date-desc') {
      const dateA = new Date(`${a.date} ${a.time.replace(/ AM| PM/i, '')}`);
      const dateB = new Date(`${b.date} ${b.time.replace(/ AM| PM/i, '')}`);
      return dateB.getTime() - dateA.getTime();
    }
    if (sortBy === 'date-asc') {
      const dateA = new Date(`${a.date} ${a.time.replace(/ AM| PM/i, '')}`);
      const dateB = new Date(`${b.date} ${b.time.replace(/ AM| PM/i, '')}`);
      return dateA.getTime() - dateB.getTime();
    }
    // Default created-desc
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Statistics
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const getServiceLabel = (val: string) => {
    switch (val) {
      case 'blowout': return 'Signature Blowout';
      case 'haircut': return 'Precision Haircut';
      case 'color': return 'Professional Color';
      case 'curly': return 'Curly Hair Session';
      case 'treatment': return 'Beauty Treatment';
      default: return val;
    }
  };

  // Block unauthorized views gracefully
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-brand-beige/30 pt-28 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-6 border border-amber-100">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-3xl font-serif mb-3 text-brand-black">Access Unauthorized</h2>
        <p className="text-brand-black/60 font-light max-w-md leading-relaxed mb-8">
          This portal hosts salon configuration & administrative tables, and is reserved strictly for authenticated Salon Directors.
        </p>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-brand-black text-white text-[10px] uppercase tracking-widest font-semibold rounded-full hover:bg-brand-nude transition-colors cursor-pointer"
        >
          Return to Guest View
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige/30 pt-28 pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Top Banner Auth Check */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-brand-blush/30 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-brand-nude text-xs uppercase tracking-widest font-bold mb-1">
              <Sparkles size={14} />
              <span>Salon Control center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-brand-black">
              Dolores Admin <span className="italic font-normal">Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 bg-brand-black hover:bg-brand-nude text-white rounded-full text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <PlusCircle size={12} />
              Add Reservation
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white hover:bg-gray-100 border border-gray-200 text-brand-black rounded-full text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft size={12} />
              Return to Site
            </button>
          </div>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 mb-6 bg-red-50 text-red-700 rounded-3xl border border-red-100 flex items-start gap-3 text-xs"
            >
              <ShieldAlert className="text-red-500 flex-shrink-0" size={16} />
              <p>{errorMsg}</p>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 mb-6 bg-emerald-50 text-emerald-800 rounded-3xl border border-emerald-100 flex items-start gap-3 text-xs"
            >
              <Sparkles className="text-emerald-600 flex-shrink-0" size={16} />
              <p>{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[32px] border border-brand-blush/20 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-brand-beige rounded-2xl text-brand-nude">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#938176]">Total Sessions</p>
              <p className="text-3xl font-serif font-bold text-brand-black">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-brand-blush/20 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-amber-50 rounded-2xl text-amber-600">
              <Clock3 size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#938176]">Pending Review</p>
              <p className="text-3xl font-serif font-bold text-brand-black">{pendingCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-brand-blush/20 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600">
              <CalendarCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#938176]">Confirmed VIPs</p>
              <p className="text-3xl font-serif font-bold text-brand-black">{confirmedCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-brand-blush/20 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-red-50 rounded-2xl text-red-500">
              <XOctagon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#938176]">Cancelled Sessions</p>
              <p className="text-3xl font-serif font-bold text-brand-black">{cancelledCount}</p>
            </div>
          </div>
        </div>

        {/* Core Controls: Search, Filter, Sort */}
        <div className="bg-white p-6 rounded-[40px] border border-brand-blush/20 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Search */}
            <div className="relative w-full lg:w-4/12 flex items-center border border-brand-blush rounded-full px-4 py-2.5 bg-brand-beige/10 focus-within:border-brand-nude group transition-all">
              <Search className="text-brand-nude mr-2" size={16} />
              <input
                type="text"
                placeholder="Search name, phone, email, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs font-light"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-black">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter by Status */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-brand-black/50 font-bold whitespace-nowrap">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-brand-blush rounded-full text-xs outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Filter by Service */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-brand-black/50 font-bold whitespace-nowrap">Service</span>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-brand-blush rounded-full text-xs outline-none cursor-pointer"
              >
                <option value="all">All Services</option>
                <option value="blowout">Signature Blowout</option>
                <option value="haircut">Precision Haircut</option>
                <option value="color">Professional Color</option>
                <option value="curly">Curly Hair Session</option>
                <option value="treatment">Beauty Treatment</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="w-full sm:w-auto flex items-center gap-2 sm:ml-auto">
              <span className="text-[10px] uppercase tracking-widest text-brand-black/50 font-bold whitespace-nowrap">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white border border-brand-blush rounded-full text-xs outline-none cursor-pointer"
              >
                <option value="created-desc">Creation Timestamp (Latest)</option>
                <option value="date-desc">Appointment Date (Newest to Oldest)</option>
                <option value="date-asc">Appointment Date (Oldest to Newest)</option>
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchAllBookings}
              disabled={loading}
              className="p-3 bg-brand-beige border border-brand-blush/50 hover:bg-brand-blush rounded-full transition-all text-brand-nude hover:text-brand-black cursor-pointer flex items-center justify-center"
              title="Refresh spreadsheet"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Master Table Grid */}
        <div className="bg-white rounded-[40px] border border-brand-blush/20 shadow-sm overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-4 border-brand-nude/20 border-t-brand-nude rounded-full"
              />
              <p className="text-xs uppercase tracking-widest text-brand-black/40 font-bold">Querying salon database...</p>
            </div>
          ) : sortedBookings.length === 0 ? (
            <div className="text-center py-20 p-8 flex flex-col items-center justify-center">
              <Calendar className="text-brand-nude mb-4" size={48} />
              <h3 className="text-2xl font-serif text-brand-black mb-1">No Bookings Found</h3>
              <p className="text-xs text-brand-black/50 font-light max-w-sm">
                No matching salon reservations fit your query or filters. Refine details above or register a guest session!
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs min-w-[900px]">
              <thead>
                <tr className="bg-brand-beige/25 border-b border-brand-blush/30 uppercase text-[10px] tracking-widest text-brand-black/60 font-semibold">
                  <th className="py-4.5 px-6">Customer Details</th>
                  <th className="py-4.5 px-6">Requested Service</th>
                  <th className="py-4.5 px-6">Date & Hour</th>
                  <th className="py-4.5 px-6">Styling Instructions</th>
                  <th className="py-4.5 px-6">Current Status</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-blush/20 text-brand-black/80 font-light">
                {sortedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-brand-beige/5 transition-all">
                    
                    {/* Customer */}
                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-brand-black text-sm">{booking.name}</div>
                      <div className="flex flex-col space-y-0.5 mt-1 text-gray-500 text-[11px] font-mono">
                        <span className="flex items-center"><Mail size={10} className="mr-1 text-brand-nude" /> {booking.email}</span>
                        <span className="flex items-center"><Phone size={10} className="mr-1 text-brand-nude" /> {booking.phone}</span>
                        <span className="text-[9px] text-[#b6a8a0] mt-1">ID: {booking.id}</span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-4.5 px-6 font-medium text-brand-black text-sm">
                      {getServiceLabel(booking.service)}
                    </td>

                    {/* Date/Time */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center font-semibold text-brand-black text-xs">
                        <Calendar size={12} className="mr-1.5 text-brand-nude" />
                        {booking.date}
                      </div>
                      <div className="flex items-center text-gray-500 mt-1 text-xs font-semibold">
                        <Clock size={12} className="mr-1.5 text-brand-nude" />
                        {booking.time}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="py-4.5 px-6 max-w-xs">
                      {booking.notes ? (
                        <p className="italic text-gray-600 line-clamp-2 leading-relaxed bg-brand-beige/10 p-2.5 rounded-2xl border border-brand-blush/10">
                          "{booking.notes}"
                        </p>
                      ) : (
                        <span className="text-gray-300 italic">None provided</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4.5 px-6">
                      <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-widest rounded-full border font-semibold ${
                        booking.status === 'confirmed' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : booking.status === 'cancelled'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Quick Action Controls */}
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {booking.status !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full transition-colors cursor-pointer"
                            title="Confirm Booking"
                          >
                            <Check size={14} />
                          </button>
                        )}

                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors cursor-pointer"
                            title="Cancel Booking"
                          >
                            <X size={14} />
                          </button>
                        )}

                        {booking.status !== 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'pending')}
                            className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-full transition-colors cursor-pointer"
                            title="Mark Pending"
                          >
                            <Clock3 size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(booking)}
                          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors cursor-pointer"
                          title="Edit details"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full transition-colors cursor-pointer"
                          title="Permanently Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE NEW GUEST BOOKING MODAL */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-8 max-h-[90vh] overflow-y-auto z-10 border border-brand-blush"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif text-brand-black">Add Custom <span className="italic">Reservation</span></h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Customer Name</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <UserIcon className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <input
                        required
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-none outline-none text-xs font-light"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Phone Number</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Phone className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <input
                        required
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full bg-transparent border-none outline-none text-xs font-light"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Email Address</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Mail className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <input
                        required
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-transparent border-none outline-none text-xs font-light"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Select Service</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Sparkles className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <select
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs cursor-pointer bg-white"
                      >
                        <option value="blowout">Signature Blowout</option>
                        <option value="haircut">Precision Haircut</option>
                        <option value="color">Professional Color</option>
                        <option value="curly">Curly Hair Session</option>
                        <option value="treatment">Beauty Treatment</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Preferred Date</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Calendar className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <input
                        required
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Preferred Time</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Clock className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <select
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs bg-white"
                      >
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Styling Notes</label>
                  <div className="flex items-start border border-brand-blush p-3 rounded-3xl">
                    <FileText className="text-brand-nude mr-2 mt-0.5 flex-shrink-0" size={14} />
                    <textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Add custom preferences, stylist notes or instruction logs..."
                      rows={3}
                      className="w-full bg-transparent border-none outline-none text-xs font-light resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-brand-black hover:bg-brand-nude text-white uppercase text-xs font-semibold rounded-full select-none cursor-pointer tracking-widest transition-all"
                  >
                    {isSubmitting ? 'Recording Session...' : 'Create Confirmed Guest Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL VIEW / EDIT MODAL SCREEN */}
      <AnimatePresence>
        {editingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingBooking(null)}
              className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-8 max-h-[90vh] overflow-y-auto z-10 border border-brand-blush"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#938176] block font-bold">Details & modifications</span>
                  <h3 className="text-2xl font-serif text-brand-black">Modify <span className="italic">Reservation</span></h3>
                </div>
                <button onClick={() => setEditingBooking(null)} className="p-1 text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Customer Name</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <UserIcon className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <input
                        required
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Phone Number</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Phone className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <input
                        required
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Email Address</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Mail className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <input
                        required
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Service</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Sparkles className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <select
                        value={editService}
                        onChange={(e) => setEditService(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs bg-white"
                      >
                        <option value="blowout">Signature Blowout</option>
                        <option value="haircut">Precision Haircut</option>
                        <option value="color">Professional Color</option>
                        <option value="curly">Curly Hair Session</option>
                        <option value="treatment">Beauty Treatment</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Appointment Date</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Calendar className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <input
                        required
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Appointment Time</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <Clock className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <select
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs bg-white"
                      >
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Approval Status</label>
                    <div className="flex items-center border border-brand-blush rounded-full px-3 py-2">
                      <ShieldAlert className="text-brand-nude mr-2 flex-shrink-0" size={14} />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full bg-transparent border-none outline-none text-xs bg-white text-brand-black"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="confirmed">Confirmed / Approved</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#938176] block mb-1">Additional Notes</label>
                  <div className="flex items-start border border-brand-blush p-3 rounded-2xl">
                    <FileText className="text-brand-nude mr-2 mt-0.5 flex-shrink-0" size={14} />
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border-none outline-none text-xs font-light resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="w-1/2 py-3.5 border border-brand-blush text-brand-black hover:bg-gray-50 uppercase text-xs font-bold rounded-full cursor-pointer tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-1/2 py-3.5 bg-brand-black hover:bg-brand-nude text-white uppercase text-xs font-bold rounded-full cursor-pointer tracking-widest transition-all"
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Updates'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
