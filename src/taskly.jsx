import { useEffect, useState } from "react";

const colors = ["bg-[#c8e6a5]","bg-[#26c7e6]","bg-[#c9b8d9]","bg-[#a5b4fc]"];
const field = "w-full min-w-0 bg-[#33426a] text-white placeholder-slate-400 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#c8e6a5]";
const btn = "bg-[#c8e6a5] text-slate-900 font-semibold rounded-xl px-4 py-2 hover:bg-[#d8f0bd]";

function Items({task, name, id, onDelete, done, onToggle}){
    return (
        <li className="flex items-center gap-3 bg-white/60 rounded-2xl px-4 py-2">
            <input type="checkbox" className="h-4 w-4 accent-slate-900" checked={!!done} onChange={()=> onToggle(id)} />
            <div className="flex-1 min-w-0">
                <p className={`font-medium break-words ${done ? "line-through opacity-60" : ""}`}>{task}</p>
                <p className="text-xs text-slate-600">{name}</p>
            </div>
            <button className="text-sm text-slate-700 hover:text-red-600" onClick={()=>onDelete(id)}>Delete</button>
        </li>
    );
}

function Notes(){
    const [task,setTask] = useState("");
    const [pro,setPro] = useState("");
    const [selected,setSelected] = useState("");
    const [name,setName] = useState("");

    {/* task item's localstorage */}
    const [list,setList] = useState(()=>{
        const save = localStorage.getItem("task");
        return save ? JSON.parse(save) : [];
    });
    useEffect(()=>{
        localStorage.setItem("task" , JSON.stringify(list));
    },[list]);

     {/* project item's localstorage */}
    const [proj,setProj] = useState(()=>{
        const s = localStorage.getItem("pro");
        return s ? JSON.parse(s) : [];
    });
    useEffect(()=>{
        localStorage.setItem("pro",JSON.stringify(proj));
    },[proj]);

    function handleAdd(){
        if(task.trim() === "" || selected === "") return;
        const t = {id:Date.now() , text:task , name:name , done:false , projectId:Number(selected)};
        setList([...list,t]);
        setTask("");
        setName("");
    }

    function handleProj(){
        if(pro.trim() === "") return;
        setProj([...proj,{id:Date.now() , text:pro}]);
        setPro("");
    }

    function handleDlt(id){
        setList(list.filter((d)=> d.id !== id));
    }

    function handleDltProj(id){
        setProj(proj.filter((p)=> p.id !== id));
        setList(list.filter((t)=> t.projectId !== id));
    }

    function handleTog(id){
        setList(list.map((d)=>
            d.id === id ? {...d,done:!d.done} : d
        ));
    }

    const done = list.filter((yes)=>yes.done);
    const count = done.length;
    const total = list.length;
    const left = total - count;

    return(
        <div className="min-h-screen bg-[#1b2848] text-white flex flex-col items-center px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Taskly</h1>

            <div className="w-full max-w-2xl flex flex-col gap-4">

                <div className="bg-[#263556] rounded-3xl p-4 flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input className={field} type="text" value={task} placeholder="Task name..." onChange={(e)=>setTask(e.target.value)} />
                        <input className={field} type="text" value={name} placeholder="Assignee's name..." onChange={(e)=>setName(e.target.value)} />
                        <select className={`${field} sm:col-span-2`} value={selected} onChange={(e)=>setSelected(e.target.value)}>
                            <option className="text-slate-900" value="">Select project</option>
                            {proj.map((m)=>(
                                <option className="text-slate-900" key={m.id} value={m.id}>{m.text}</option>
                            ))}
                        </select>
                    </div>
                    <button className={btn} onClick={handleAdd}>Add task</button>
                </div>

                <div className="bg-[#263556] rounded-3xl p-4 flex gap-2">
                    <input className={field} type="text" value={pro} placeholder="New project..." onChange={(e)=>setPro(e.target.value)} />
                    <button className={btn} onClick={handleProj}>Add</button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#263556] rounded-2xl p-3 text-center">
                        <p className="text-2xl font-bold">{total}</p>
                        <p className="text-xs text-slate-400">Total</p>
                    </div>
                    <div className="bg-[#263556] rounded-2xl p-3 text-center">
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs text-slate-400">Done</p>
                    </div>
                    <div className="bg-[#263556] rounded-2xl p-3 text-center">
                        <p className="text-2xl font-bold">{left}</p>
                        <p className="text-xs text-slate-400">Left</p>
                    </div>
                </div>

                {proj.length === 0 ?
                <p className="text-center text-slate-400">No projects yet...</p>
                :
                <ul className="flex flex-col gap-10 mt-2">
                    {proj.map((p,i)=>{
                        const mine = list.filter((t)=> t.projectId === p.id);
                        const doneN = mine.filter((t)=> t.done).length;
                        const pct = mine.length === 0 ? 0 : Math.round(doneN / mine.length * 100);
                        const bg = colors[i % colors.length];
                        const status = pct === 0 ? "Upcoming" : pct === 100 ? "Completed" : "Running";
                        return (
                            <li key={p.id}>

                                <div className="flex items-end justify-between h-9">
                                    <span className={`${bg} text-slate-900 text-xs font-semibold rounded-t-2xl px-5 pt-2 pb-1`}>{status}</span>
                                    <div className="flex items-center gap-2 pb-1">
                                        <div className="w-24 h-1.5 rounded-full bg-white/20">
                                            <div className="h-1.5 rounded-full bg-[#c8e6a5]" style={{width:`${pct}%`}}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#c8e6a5]">{pct}%</span>
                                    </div>
                                </div>

                                <div className={`${bg} rounded-3xl rounded-tl-none p-5 text-slate-900`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 shrink-0 rotate-45 rounded-2xl bg-slate-900 flex items-center justify-center">
                                            <span className="-rotate-45 text-white text-sm font-semibold">{mine.length}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xl font-semibold break-words">{p.text}</p>
                                            <p className="text-sm text-slate-700">{doneN} of {mine.length} tasks done</p>
                                        </div>
                                        <button className="bg-slate-900 text-white text-sm rounded-full px-4 py-2 hover:bg-slate-700"
                                        onClick={()=>handleDltProj(p.id)}>Delete</button>
                                    </div>

                                    {mine.length > 0 && (
                                        <ul className="flex flex-col gap-2 mt-4 pt-4 border-t border-dashed border-slate-900/30">
                                            {mine.map((t)=>(
                                                <Items key={t.id} id={t.id} task={t.text} name={t.name} done={t.done} onDelete={handleDlt} onToggle={handleTog} />
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </li>
                        );
                    })}
                </ul>
                }

            </div>
        </div>
    );
}
export default Notes;