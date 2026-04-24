import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { ExtraGroup, ExtraOption } from "@/data/menu";

type Props = {
  value: ExtraGroup[];
  onChange: (next: ExtraGroup[]) => void;
};

const KIND_LABEL: Record<ExtraGroup["kind"], string> = {
  free: "Grátis (limite)",
  paid: "Pagos (qtd livre)",
  single: "Escolha única",
};

export function ExtrasEditor({ value, onChange }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(value.length ? 0 : null);

  const updateGroup = (i: number, patch: Partial<ExtraGroup>) => {
    const next = value.map((g, k) => (k === i ? { ...g, ...patch } : g));
    onChange(next);
  };

  const addGroup = () => {
    const id = `g${Date.now().toString(36)}`;
    const next = [
      ...value,
      { id, title: "Nova categoria", kind: "free", max: 3, options: [] } as ExtraGroup,
    ];
    onChange(next);
    setOpenIdx(next.length - 1);
  };

  const removeGroup = (i: number) => {
    if (!confirm("Remover esta categoria de extras?")) return;
    onChange(value.filter((_, k) => k !== i));
    setOpenIdx(null);
  };

  const moveGroup = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const addOption = (gi: number) => {
    const opt: ExtraOption = { id: `o${Date.now().toString(36)}`, name: "Novo item", price: 0 };
    updateGroup(gi, { options: [...value[gi].options, opt] });
  };

  const updateOption = (gi: number, oi: number, patch: Partial<ExtraOption>) => {
    const next = value[gi].options.map((o, k) => (k === oi ? { ...o, ...patch } : o));
    updateGroup(gi, { options: next });
  };

  const removeOption = (gi: number, oi: number) => {
    updateGroup(gi, { options: value[gi].options.filter((_, k) => k !== oi) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-admin-muted">
          Categorias de acompanhamentos (frutas, complementos, colher, etc).
        </p>
        <button type="button" className="admin-btn admin-btn-outline" onClick={addGroup}>
          <Plus className="size-4" /> Categoria
        </button>
      </div>

      {value.length === 0 && (
        <div className="rounded-lg border border-dashed border-admin-border p-4 text-center text-sm text-admin-muted">
          Nenhum acompanhamento. Clique em "Categoria" pra criar.
        </div>
      )}

      {value.map((g, gi) => {
        const open = openIdx === gi;
        return (
          <div key={g.id} className="rounded-xl border border-admin-border bg-admin-soft/40">
            <div className="flex items-center gap-2 p-2.5">
              <div className="flex flex-col">
                <button type="button" onClick={() => moveGroup(gi, -1)} className="text-admin-muted hover:text-admin-fg" aria-label="Subir">
                  <ChevronUp className="size-3" />
                </button>
                <button type="button" onClick={() => moveGroup(gi, 1)} className="text-admin-muted hover:text-admin-fg" aria-label="Descer">
                  <ChevronDown className="size-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : gi)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <GripVertical className="size-4 shrink-0 text-admin-muted" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-admin-fg">{g.title || "(sem título)"}</p>
                  <p className="truncate text-[11px] text-admin-muted">
                    {KIND_LABEL[g.kind]} · {g.options.length} {g.options.length === 1 ? "item" : "itens"}
                    {g.required ? " · obrigatório" : ""}
                  </p>
                </div>
              </button>
              <button type="button" className="admin-btn admin-btn-danger px-2.5" onClick={() => removeGroup(gi)} aria-label="Remover">
                <Trash2 className="size-4" />
              </button>
            </div>

            {open && (
              <div className="space-y-3 border-t border-admin-border p-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium text-admin-muted">Título</span>
                    <input
                      className="admin-input"
                      value={g.title}
                      onChange={(e) => updateGroup(gi, { title: e.target.value })}
                      placeholder="Ex: Frutas grátis"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium text-admin-muted">Tipo</span>
                    <select
                      className="admin-input"
                      value={g.kind}
                      onChange={(e) => updateGroup(gi, { kind: e.target.value as ExtraGroup["kind"] })}
                    >
                      <option value="free">Grátis (com limite)</option>
                      <option value="paid">Pagos (qtd livre)</option>
                      <option value="single">Escolha única (radio)</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-medium text-admin-muted">Descrição (opcional)</span>
                  <input
                    className="admin-input"
                    value={g.description ?? ""}
                    onChange={(e) => updateGroup(gi, { description: e.target.value })}
                    placeholder="Ex: Escolha até 3 frutas sem custo"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {g.kind === "free" && (
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-medium text-admin-muted">Limite (max)</span>
                      <input
                        className="admin-input"
                        type="number"
                        min={1}
                        value={g.max ?? 3}
                        onChange={(e) => updateGroup(gi, { max: parseInt(e.target.value) || 1 })}
                      />
                    </label>
                  )}
                  <label className="flex items-end gap-2 pb-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!g.required}
                      onChange={(e) => updateGroup(gi, { required: e.target.checked })}
                    />
                    Obrigatório
                  </label>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-admin-muted">Opções</span>
                    <button type="button" className="admin-btn admin-btn-ghost px-2" onClick={() => addOption(gi)}>
                      <Plus className="size-3.5" /> Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {g.options.length === 0 && (
                      <p className="rounded border border-dashed border-admin-border p-2 text-center text-xs text-admin-muted">
                        Nenhum item.
                      </p>
                    )}
                    {g.options.map((o, oi) => (
                      <div key={o.id} className="flex items-center gap-2">
                        <input
                          className="admin-input flex-1"
                          value={o.name}
                          onChange={(e) => updateOption(gi, oi, { name: e.target.value })}
                          placeholder="Nome do item"
                        />
                        <input
                          className="admin-input w-24"
                          type="number"
                          step="0.10"
                          min={0}
                          value={o.price}
                          onChange={(e) => updateOption(gi, oi, { price: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          title="Preço (0 = grátis)"
                        />
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger px-2"
                          onClick={() => removeOption(gi, oi)}
                          aria-label="Remover item"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
