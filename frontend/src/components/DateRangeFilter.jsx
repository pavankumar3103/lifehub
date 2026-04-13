export default function DateRangeFilter({ startDate, endDate, setStartDate, setEndDate, focusBorderClass = "focus:border-orange-500" }) {
    return (
        <div className="flex gap-4 items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 w-fit">
            <div className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1">From</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className={`bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${focusBorderClass}`}
                />
            </div>
            <div className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1">To</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className={`bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${focusBorderClass}`}
                />
            </div>
            {(startDate || endDate) && (
                <button
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="text-slate-400 hover:text-white mt-5 text-sm underline"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
