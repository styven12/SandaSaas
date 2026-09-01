import React, { useState, useEffect } from 'react';
import API from '../../../services/api';
import { stockService } from '../../../services/stockService';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

export default function CsvUploader({
  zones = [],
  onUploadSuccess,
  onClose,
}) {
  const [file, setFile] = useState(null);
  const [selectedZone, setSelectedZone] = useState(
    zones[0]?._id || zones[0]?.id || ''
  );

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);

  const [message, setMessage] = useState(null);

  /*
   * ============================================================
   * CHARGEMENT DES FORFAITS DE LA ZONE
   * ============================================================
   */
  useEffect(() => {
    const loadPlans = async () => {
      if (!selectedZone) {
        setPlans([]);
        setSelectedPlan(null);
        return;
      }

      try {
        setPlansLoading(true);
        setMessage(null);

        const response = await API.get(`/plans/zone/${selectedZone}`);

        const zonePlans = Array.isArray(response.data)
          ? response.data
          : [];

        setPlans(zonePlans);

        // Sélection automatique du premier forfait
        if (zonePlans.length > 0) {
          setSelectedPlan(zonePlans[0]);
        } else {
          setSelectedPlan(null);
        }
      } catch (err) {
        console.error('Erreur chargement plans:', err);

        setPlans([]);
        setSelectedPlan(null);

        setMessage({
          type: 'error',
          text:
            err.response?.data?.error ||
            'Impossible de charger les forfaits de cette zone.',
        });
      } finally {
        setPlansLoading(false);
      }
    };

    loadPlans();
  }, [selectedZone]);

  /*
   * ============================================================
   * SÉLECTION DU FICHIER
   * ============================================================
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setMessage(null);

    // Vérification extension
    const fileName = selectedFile.name.toLowerCase();

    if (!fileName.endsWith('.csv')) {
      setFile(null);

      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner un fichier CSV (.csv).',
      });

      return;
    }

    // Vérification taille : 5 MB maximum
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);

      setMessage({
        type: 'error',
        text: 'Le fichier CSV ne doit pas dépasser 5 Mo.',
      });

      return;
    }

    setFile(selectedFile);
  };

  /*
   * ============================================================
   * SUPPRESSION DU FICHIER
   * ============================================================
   */
  const handleRemoveFile = () => {
    setFile(null);
    setMessage(null);
  };

  /*
   * ============================================================
   * IMPORTATION CSV
   * ============================================================
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);

    /*
     * Vérification fichier
     */
    if (!file) {
      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner un fichier CSV.',
      });

      return;
    }

    /*
     * Vérification zone
     */
    if (!selectedZone) {
      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner une zone.',
      });

      return;
    }

    /*
     * Vérification forfait
     */
    if (!selectedPlan) {
      setMessage({
        type: 'error',
        text:
          'Aucun forfait disponible pour cette zone. ' +
          'Créez d’abord un forfait avant d’importer des tickets.',
      });

      return;
    }

    /*
     * Récupération robuste de l'ID du forfait
     */
    const planId = selectedPlan?._id || selectedPlan?.id;

    if (!planId) {
      setMessage({
        type: 'error',
        text: 'Impossible de récupérer l’identifiant du forfait.',
      });

      return;
    }

    try {
      setLoading(true);

      /*
       * Création du FormData
       */
      const formData = new FormData();

      formData.append('file', file);
      formData.append('zone_id', selectedZone);
      formData.append('plan_id', planId);

      /*
       * Envoi vers le backend
       */
      const res = await stockService.uploadCsv(formData);

      /*
       * Message de succès
       */
      setMessage({
        type: 'success',
        text:
          res?.message ||
          `${res?.imported_count ?? res?.insertedCount ?? 0} tickets importés avec succès !`,
      });

      /*
       * Reset du fichier
       */
      setFile(null);

      /*
       * Actualisation de la liste
       */
      if (typeof onUploadSuccess === 'function') {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('Erreur import CSV:', err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'importation du fichier.";

      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-blue-400" />

          Importer des Tickets MikroTik (CSV)
        </h3>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}

          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ZONE */}
        {zones.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Associer à la Zone
            </label>

            <select
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setSelectedPlan(null);
              }}
              disabled={loading}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              {zones.map((zone) => {
                const zoneId = zone._id || zone.id;

                return (
                  <option key={zoneId} value={zoneId}>
                    {zone.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* FORFAIT */}
        {selectedZone && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Forfait associé
            </label>

            {plansLoading ? (
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Chargement des forfaits…
              </div>
            ) : plans.length > 0 ? (
              <select
                value={selectedPlan?._id || selectedPlan?.id || ''}
                onChange={(e) => {
                  const plan = plans.find(
                    (p) =>
                      (p._id || p.id) === e.target.value
                  );

                  setSelectedPlan(plan || null);
                }}
                disabled={loading}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                {plans.map((plan) => {
                  const planId = plan._id || plan.id;

                  return (
                    <option key={planId} value={planId}>
                      {plan.name} — {plan.price} FCFA
                    </option>
                  );
                })}
              </select>
            ) : (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400">
                Aucun forfait trouvé pour cette zone.
              </div>
            )}
          </div>
        )}

        {/* CSV UPLOAD */}
        <div>
          <label
            htmlFor="csv-upload"
            className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition"
          >
            <FileText className="w-8 h-8 text-slate-500" />

            <span className="text-xs text-slate-300 font-medium text-center">
              {file
                ? file.name
                : 'Cliquez ou glissez votre fichier .CSV ici'}
            </span>

            <span className="text-[11px] text-slate-500 text-center">
              Format accepté : code, password, profile, duration
            </span>

            {file && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-[11px] text-red-400 hover:text-red-300"
              >
                Supprimer le fichier
              </button>
            )}

            <input
              id="csv-upload"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* BOUTON */}
        <button
          type="submit"
          disabled={
            loading ||
            !file ||
            !selectedPlan ||
            !selectedZone ||
            plansLoading
          }
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
        >
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}

          {loading
            ? 'Importation en cours…'
            : plansLoading
            ? 'Chargement du forfait…'
            : "Lancer l'importation"}
        </button>

      </form>
    </div>
  );
}
