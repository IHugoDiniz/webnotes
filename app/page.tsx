'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [notes, setNotes] = useState<any[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)

  /*salvar*/
  async function addNote() {
    await supabase
      .from('notes')
      .insert({ title: title, content: content })

    setTitle('')
    setContent('')
    loadNotes()
  }

  /*buscar*/
  async function loadNotes() {
    const res = await fetch('/api/notes')
    const data = await res.json()
    setNotes(data ?? [])
  }

  /*excluir*/
  async function deleteNote(id: number) {
    await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    loadNotes()
  }

  /*editar*/
  async function updateNote(id: number) {
    await supabase
      .from('notes')
      .update({ title: title, content: content })
      .eq('id', id)

    setEditingId(null)
    setTitle('')
    setContent('')
    loadNotes()
  }

  /*carregar*/
  useEffect(() => {
    loadNotes()
  }, [])

  return (
    <div>

      {/*header*/}
      <div style={{ background: 'black', color: 'white', padding: 20, fontSize: '20px', fontWeight: 'bold' }}>
        Note App
      </div>

      {/*form*/}
      <div style={{ padding: 20 }}>
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', fontWeight : 'bold'}}
        />
        <br /><br />

        <textarea
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%' }}
        />
        <br /><br />

        {editingId ? (
          <button onClick={() => updateNote(editingId)}>Salvar edição</button>
        ) : (
          <button onClick={addNote}>Salvar</button>
        )}
      </div>

      {/*lista*/}
      <div style={{ padding: 20 }}>
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              background: editingId === note.id ? 'black' : 'transparent',
              color: editingId === note.id ? 'white' : 'black',
              padding: 5
            }}
          >
            <h3 style={{ wordBreak: 'break-word', fontSize: '20px', fontWeight: 'bold' }}>
              {note.title}
            </h3>
            
            <p style={{ maxWidth: '100%', wordBreak: 'break-word' }}>
              {expandedId === note.id
                ? note.content
                : note.content.slice(0, 100) + (note.content.length > 100 ? '...' : '')}
            </p>

            {/*opcoes*/}
            <div style={{ marginTop: 15 }}>
              
              {note.content.length > 100 && (
                <button
                  style={{ marginRight: 15 }}
                  onClick={() =>
                    setExpandedId(expandedId === note.id ? null : note.id)
                  }
                >
                  {expandedId === note.id ? 'Ocultar' : 'Ver mais'}
                </button>
              )}

              <button
                style={{ marginRight: 15 }}
                onClick={() => {
                  setEditingId(note.id)
                  setTitle(note.title)
                  setContent(note.content)
                }}
                disabled={editingId === note.id}
              >
                Editar
              </button>

              <button onClick={() => deleteNote(note.id)}>
                Excluir
              </button>

            </div>

            <hr />
          </div>
        ))}
      </div>

    </div>
  )
}