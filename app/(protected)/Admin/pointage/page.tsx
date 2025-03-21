'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, FileText, CheckSquare, Upload } from 'lucide-react';

// Define types for our data structures
interface Employee {
    id: string;
    nom: string;
    prenom: string;
    cin: string;
    dateNaissance: string;
    lieuNaissance: string;
    adresseDomicile: string;
    cnss: string;
    origine: string;
    niveauEtude: string;
    specialite: string;
    dateEntretien: string;
    dateEmbauche: string;
    description: string;
}

interface AttendanceRecord {
    employeeId: string;
    date: string;
    timeIn: string;
    timeOut: string | null;
    status: 'present' | 'late' | 'absent';
}

interface AbsenceRecord {
    employeeId: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    documentUrl?: string;
}

interface AbsenceFormData {
    employeeId: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    hasDocument: boolean;
}

export default function AttendancePage() {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'attendance' | 'absences'>('attendance');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [absenceRecords, setAbsenceRecords] = useState<AbsenceRecord[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [showAbsenceForm, setShowAbsenceForm] = useState<boolean>(false);
    const [absenceFormData, setAbsenceFormData] = useState<AbsenceFormData>({
        employeeId: '',
        type: '',
        startDate: '',
        endDate: '',
        reason: '',
        hasDocument: false
    });

    const absenceTypes = [
        'Maladie',
        'Rendez-vous médical',
        'Formation',
        'Congé sans solde',
        'Événement familial',
        'Autre'
    ];

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
            setCurrentDate(now.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }));
        };

        updateDateTime();
        const timer = setInterval(updateDateTime, 1000);

        fetchEmployees();
        fetchTodayAttendance();
        fetchAbsences();

        return () => clearInterval(timer);
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/employees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchTodayAttendance = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`/api/attendance?date=${today}`);
            const data = await response.json();
            setAttendanceRecords(data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const fetchAbsences = async () => {
        try {
            const response = await fetch('/api/absences');
            const data = await response.json();
            setAbsenceRecords(data);
        } catch (error) {
            console.error('Error fetching absences:', error);
        }
    };

    const handleAttendanceSubmit = async (employeeId: string, type: 'in' | 'out') => {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toISOString().split('T')[0];

        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId,
                    date,
                    time,
                    type,
                }),
            });

            if (response.ok) {
                fetchTodayAttendance();
            }
        } catch (error) {
            console.error('Error recording attendance:', error);
        }
    };

    const handleAbsenceSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/absences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(absenceFormData),
            });

            if (response.ok) {
                setShowAbsenceForm(false);
                setAbsenceFormData({
                    employeeId: '',
                    type: '',
                    startDate: '',
                    endDate: '',
                    reason: '',
                    hasDocument: false
                });
                fetchAbsences();
            }
        } catch (error) {
            console.error('Error submitting absence:', error);
        }
    };

    const handleAbsenceFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setAbsenceFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Présences et Absences</h1>
                <p className="text-gray-600">{currentDate}</p>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'attendance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('attendance')}
                >
                    <Clock className="inline-block mr-2 h-4 w-4" />
                    Pointage
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'absences' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('absences')}
                >
                    <Calendar className="inline-block mr-2 h-4 w-4" />
                    Absences
                </button>
            </div>

            {activeTab === 'attendance' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Enregistrer une Présence</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sélectionner un employé
                                    </label>
                                    <select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Choisir un employé</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.nom} {employee.prenom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleAttendanceSubmit(selectedEmployee, 'in')}
                                        disabled={!selectedEmployee}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Pointer l&apos;Arrivée
                                    </button>
                                    <button
                                        onClick={() => handleAttendanceSubmit(selectedEmployee, 'out')}
                                        disabled={!selectedEmployee}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Pointer le Départ
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Statistiques du Jour</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {attendanceRecords.filter(r => r.status === 'present').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Présents</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {attendanceRecords.filter(r => r.status === 'late').length}
                                    </div>
                                    <div className="text-sm text-gray-600">En Retard</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">
                                        {attendanceRecords.filter(r => r.status === 'absent').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Absents</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Registre des Présences du Jour</h2>
                            <table className="min-w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Employé</th>
                                    <th className="text-left py-3 px-4">Heure d&apos;Arrivée</th>
                                    <th className="text-left py-3 px-4">Heure de Départ</th>
                                    <th className="text-left py-3 px-4">Statut</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attendanceRecords.map((record, index) => {
                                    const employee = employees.find(e => e.id === record.employeeId);
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="py-3 px-4">
                                                {employee ? `${employee.nom} ${employee.prenom}` : 'N/A'}
                                            </td>
                                            <td className="py-3 px-4">{record.timeIn}</td>
                                            <td className="py-3 px-4">{record.timeOut || '-'}</td>
                                            <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                                                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                        {record.status === 'present' && <CheckCircle className="w-4 h-4 mr-1" />}
                                                        {record.status === 'late' && <AlertCircle className="w-4 h-4 mr-1" />}
                                                        {record.status === 'absent' && <XCircle className="w-4 h-4 mr-1" />}
                                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'absences' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Statistiques des Absences</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {absenceRecords.filter(r => r.status === 'pending').length}
                                    </div>
                                    <div className="text-sm text-gray-600">En Attente</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {absenceRecords.filter(r => r.status === 'approved').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Approuvées</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">
                                        {absenceRecords.filter(r => r.status === 'rejected').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Refusées</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Actions</h2>
                            <button
                                onClick={() => setShowAbsenceForm(true)}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Calendar className="inline-block mr-2 h-5 w-5" />
                                Déclarer une Absence
                            </button>
                        </div>
                    </div>

                    {showAbsenceForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg m-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Déclarer une Absence</h3>
                                    <button
                                        onClick={() => setShowAbsenceForm(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <XCircle className="h-6 w-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleAbsenceSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Employé
                                        </label>
                                        <select
                                            name="employeeId"
                                            value={absenceFormData.employeeId}
                                            onChange={handleAbsenceFormChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        >
                                            <option value="">Sélectionner un employé</option>
                                            {employees.map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.nom} {employee.prenom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Type d&apos;absence
                                        </label>
                                        <select
                                            name="type"
                                            value={absenceFormData.type}
                                            onChange={handleAbsenceFormChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        >
                                            <option value="">Sélectionner un type</option>
                                            {absenceTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date de début
                                            </label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={absenceFormData.startDate}
                                                onChange={handleAbsenceFormChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date de fin
                                            </label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={absenceFormData.endDate}
                                                onChange={handleAbsenceFormChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Motif
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={absenceFormData.reason}
                                            onChange={handleAbsenceFormChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="hasDocument"
                                            name="hasDocument"
                                            checked={absenceFormData.hasDocument}
                                            onChange={handleAbsenceFormChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="hasDocument" className="ml-2 block text-sm text-gray-700">
                                            J&apos;ai un justificatif à fournir
                                        </label>
                                    </div>

                                    {absenceFormData.hasDocument && (
                                        <div className="mt-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Joindre un justificatif
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                                <div className="space-y-1 text-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                            <span>Télécharger un fichier</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                        </label>
                                                        <p className="pl-1">ou glisser-déposer</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, PDF jusqu&apos;à 10MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowAbsenceForm(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Soumettre
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-md">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Liste des Absences</h2>
                            <table className="min-w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Employé</th>
                                    <th className="text-left py-3 px-4">Type</th>
                                    <th className="text-left py-3 px-4">Période</th>
                                    <th className="text-left py-3 px-4">Statut</th>
                                    <th className="text-left py-3 px-4">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {absenceRecords.map((record, index) => {
                                    const employee = employees.find(e => e.id === record.employeeId);
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="py-3 px-4">
                                                {employee ? `${employee.nom} ${employee.prenom}` : 'N/A'}
                                            </td>
                                            <td className="py-3 px-4">{record.type}</td>
                                            <td className="py-3 px-4">
                                                {new Date(record.startDate).toLocaleDateString('fr-FR')} - {new Date(record.endDate).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        record.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                        {record.status === 'approved' && <CheckCircle className="w-4 h-4 mr-1" />}
                                                        {record.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
                                                        {record.status === 'rejected' && <XCircle className="w-4 h-4 mr-1" />}
                                                        {record.status === 'approved' ? 'Approuvée' :
                                                            record.status === 'pending' ? 'En attente' : 'Refusée'}
                                                    </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <FileText className="h-5 w-5" />
                                                    </button>
                                                    {record.status === 'pending' && (
                                                        <>
                                                            <button className="text-green-600 hover:text-green-800">
                                                                <CheckSquare className="h-5 w-5" />
                                                            </button>
                                                            <button className="text-red-600 hover:text-red-800">
                                                                <XCircle className="h-5 w-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}