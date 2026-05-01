"use client";

import type {
  InputMode,
  InsulationType,
  InstallationType,
  PowerUnit,
  SystemType,
} from "@/types/eletrica";

export interface FormState {
  modo: InputMode;
  corrente: string;
  potenciaKw: string;
  unidadePotencia: PowerUnit;
  fatorPotencia: string;
  sistema: SystemType;
  tensao: string;
  comprimento: string;
  cabosParalelos: 1 | 2 | 3 | 4;
  quedaMaximaPercentual: 2 | 3 | 4 | 5;
  instalacao: InstallationType;
  isolacao: InsulationType;
  temperatura: string;
  agrupamento: 1 | 2 | 3 | 4 | 5 | 6;
}

export const estadoInicial: FormState = {
  modo: "corrente",
  corrente: "",
  potenciaKw: "",
  unidadePotencia: "kW",
  fatorPotencia: "0.92",
  sistema: "monofasico",
  tensao: "220",
  comprimento: "",
  cabosParalelos: 4,
  quedaMaximaPercentual: 4,
  instalacao: "embutido",
  isolacao: "PVC",
  temperatura: "30",
  agrupamento: 1,
};

interface Props {
  value: FormState;
  onChange: (v: FormState) => void;
  onReset: () => void;
}

const labelCls = "block text-sm font-medium text-slate-700 mb-1";
const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";
const sectionCls = "space-y-1";

export default function CableSizingForm({ value, onChange, onReset }: Props) {
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dados do circuito</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-slate-600 underline underline-offset-2 hover:text-slate-900"
        >
          Limpar
        </button>
      </div>

      <div className={sectionCls}>
        <span className={labelCls}>Modo de entrada</span>
        <div className="flex gap-2">
          {(["corrente", "potencia"] as InputMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set("modo", m)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                value.modo === m
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {m === "corrente" ? "Corrente" : "Potência"}
            </button>
          ))}
        </div>
      </div>

      {value.modo === "corrente" ? (
        <div className={sectionCls}>
          <label className={labelCls} htmlFor="corrente">
            Corrente (A)
          </label>
          <input
            id="corrente"
            type="number"
            min={0}
            step="any"
            className={inputCls}
            value={value.corrente}
            onChange={(e) => set("corrente", e.target.value)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className={sectionCls}>
            <label className={labelCls} htmlFor="potencia">
              Potência
            </label>
            <input
              id="potencia"
              type="number"
              min={0}
              step="any"
              className={inputCls}
              value={value.potenciaKw}
              onChange={(e) => set("potenciaKw", e.target.value)}
            />
          </div>
          <div className={sectionCls}>
            <label className={labelCls} htmlFor="unidadePotencia">
              Unidade
            </label>
            <select
              id="unidadePotencia"
              className={inputCls}
              value={value.unidadePotencia}
              onChange={(e) =>
                set("unidadePotencia", e.target.value as PowerUnit)
              }
            >
              <option value="W">W</option>
              <option value="kW">kW</option>
              <option value="CV">CV</option>
            </select>
          </div>
          <div className={sectionCls}>
            <label className={labelCls} htmlFor="fp">
              Fator de potência
            </label>
            <input
              id="fp"
              type="number"
              min={0}
              max={1}
              step="0.01"
              className={inputCls}
              value={value.fatorPotencia}
              onChange={(e) => set("fatorPotencia", e.target.value)}
            />
          </div>
        </div>
      )}

      <div className={sectionCls}>
        <span className={labelCls}>Sistema</span>
        <div className="flex gap-2">
          {(["monofasico", "trifasico"] as SystemType[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("sistema", s)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                value.sistema === s
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {s === "monofasico" ? "Monofásico" : "Trifásico"}
            </button>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <label className={labelCls} htmlFor="tensao">
          Tensão (V)
        </label>
        <input
          id="tensao"
          type="number"
          min={0}
          step="any"
          className={inputCls}
          value={value.tensao}
          onChange={(e) => set("tensao", e.target.value)}
        />
        <div className="mt-1 flex gap-2">
          {["127", "220", "380"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("tensao", t)}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
            >
              {t} V
            </button>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <label className={labelCls} htmlFor="comprimento">
          Comprimento de ida (m)
        </label>
        <input
          id="comprimento"
          type="number"
          min={0}
          step="any"
          className={inputCls}
          value={value.comprimento}
          onChange={(e) => set("comprimento", e.target.value)}
        />
      </div>

      <div className={sectionCls}>
        <span className={labelCls}>Cabos em paralelo por fase (máximo)</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set("cabosParalelos", n as 1 | 2 | 3 | 4)}
              className={`w-10 rounded-md border px-0 py-1.5 text-sm ${
                value.cabosParalelos === n
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <span className={labelCls}>Queda de tensão máxima</span>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => set("quedaMaximaPercentual", q as 2 | 3 | 4 | 5)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                value.quedaMaximaPercentual === q
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {q}%
            </button>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <span className={labelCls}>Instalação</span>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["embutido", "Eletroduto embutido"],
              ["aparente", "Eletroduto aparente"],
              ["ar", "Cabo ao ar"],
            ] as [InstallationType, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("instalacao", key)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                value.instalacao === key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <span className={labelCls}>Isolação</span>
        <div className="flex gap-2">
          {(
            [
              ["PVC", "PVC 70°C"],
              ["XLPE", "XLPE/EPR 90°C"],
            ] as [InsulationType, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("isolacao", key)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                value.isolacao === key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={sectionCls}>
          <label className={labelCls} htmlFor="temp">
            Temperatura ambiente (°C)
          </label>
          <input
            id="temp"
            type="number"
            step="any"
            className={inputCls}
            value={value.temperatura}
            onChange={(e) => set("temperatura", e.target.value)}
          />
        </div>
        <div className={sectionCls}>
          <span className={labelCls}>Agrupamento (circuitos)</span>
          <div className="flex flex-wrap gap-1">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  set("agrupamento", n as 1 | 2 | 3 | 4 | 5 | 6)
                }
                className={`w-9 rounded-md border px-0 py-1.5 text-sm ${
                  value.agrupamento === n
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
