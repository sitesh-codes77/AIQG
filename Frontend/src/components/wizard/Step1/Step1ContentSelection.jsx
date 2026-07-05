import { useState, useEffect } from 'react'
import { getBooks, getBookChapters } from '../../../services/api'
import MultiSelectBookDropdown from '../../ui/MultiSelectBookDropdown'
import MultiSelectDropdown from '../../ui/MultiSelectDropdown'
import SearchBooksBar from './SearchBooksBar'
import SearchResults from './SearchResults'
import SelectedChaptersList from './SelectedChaptersList'

/* ── Main Step 1 Component ── */
export default function Step1ContentSelection({ data, onChange }) {
  const [allBooks, setAllBooks] = useState([])
  const [chapters, setChapters] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchActive, setSearchActive] = useState(false)

  // Fetch all books on mount
  useEffect(() => {
    getBooks()
      .then(res => setAllBooks(res.data))
      .catch(err => console.error("Error fetching books:", err))
  }, [])

  // Fetch chapters for ALL selected books concurrently (Task 2)
  useEffect(() => {
    if (!data.books || data.books.length === 0) {
      setChapters([])
      return
    }
    setIsLoading(true)
    Promise.all(
      data.books.map(book =>
        getBookChapters(book.id)
          .then(res => res.data.map(ch => ({ ...ch, bookId: book.id, bookLabel: book.label })))
          .catch(() => []) // If one book fails, don't crash all
      )
    )
      .then(results => setChapters(results.flat()))
      .catch(err => console.error("Error fetching chapters:", err))
      .finally(() => setIsLoading(false))
  }, [JSON.stringify(data.books?.map(b => b.id))])

  // ── Shared book toggle (used by BOTH search results AND dropdown) ──
  const toggleBook = (bookObj) => {
    const currentBooks = data.books || []
    const exists = currentBooks.some(b => b.id === bookObj.id)

    if (exists) {
      // REMOVING a book — only remove chapters belonging to this book
      const newBooks = currentBooks.filter(b => b.id !== bookObj.id)
      const removedBookId = bookObj.id
      const chaptersOfRemovedBook = new Set(
        chapters.filter(c => c.bookId === removedBookId).map(c => c.id)
      )
      const newChapterIds = (data.chapters || []).filter(id => !chaptersOfRemovedBook.has(id))
      const newMap = { ...data.chapterMap }
      for (const id of chaptersOfRemovedBook) delete newMap[id]
      onChange({ ...data, books: newBooks, chapters: newChapterIds, chapterMap: newMap })
    } else {
      // ADDING a book — keep existing chapters untouched
      const newBooks = [...currentBooks, bookObj]
      onChange({ ...data, books: newBooks })
    }
  }

  const toggleAllBooks = () => {
    const allSelected = allBooks.length > 0 && (data.books || []).length === allBooks.length
    if (allSelected) {
      // Deselect all — clear everything
      onChange({ ...data, books: [], chapters: [], chapterMap: {} })
    } else {
      // Select all — keep existing chapters (they still belong to valid books)
      const allBookObjs = allBooks.map(b => ({ id: b.id, label: b.label }))
      onChange({ ...data, books: allBookObjs })
    }
  }

  // ── Chapter handlers ──
  const handleChaptersChange = (selectedIds) => {
    const chapterMap = {}
    for (const id of selectedIds) {
      const ch = chapters.find(c => c.id === id)
      if (ch) chapterMap[id] = ch.label
    }
    onChange({ ...data, chapters: selectedIds, chapterMap })
  }

  const removeChapter = (chapterId) => {
    const newChapters = (data.chapters || []).filter(id => id !== chapterId)
    const newMap = { ...data.chapterMap }
    delete newMap[chapterId]
    onChange({ ...data, chapters: newChapters, chapterMap: newMap })
  }

  // ── Search filtering (client-side) ──
  const handleSearch = (e) => {
    e?.preventDefault()
    setSearchActive(searchQuery.trim().length > 0)
  }

  const filteredBooks = searchActive
    ? allBooks.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const bookOptions = allBooks.map(b => ({ value: b.id, label: b.label }))
  const chapterOptions = chapters.map(c => ({ value: c.id, label: c.label }))

  const selectedBookIds = (data.books || []).map(b => b.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.3rem' }}>Content Selection</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Choose textbooks and chapters to draw questions from.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── Search Bar ── */}
        <SearchBooksBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          setSearchActive={setSearchActive}
        />

        {/* ── Search Results (YouTube-style) ── */}
        {searchActive && (
          <SearchResults
            filteredBooks={filteredBooks}
            searchQuery={searchQuery}
            selectedBookIds={selectedBookIds}
            toggleBook={toggleBook}
            onClose={() => { setSearchQuery(''); setSearchActive(false) }}
          />
        )}

        {/* ── Multi-select Book Dropdown ── */}
        <MultiSelectBookDropdown
          label="Select Books"
          options={bookOptions}
          selected={data.books || []}
          onToggle={toggleBook}
          onToggleAll={toggleAllBooks}
        />

        {/* ── Chapter Dropdown (shows chapters from ALL selected books) ── */}
        {(data.books || []).length > 0 ? (
          <MultiSelectDropdown
            label={isLoading ? "Loading chapters..." : "Select Chapters"}
            options={chapterOptions}
            selected={data.chapters}
            onChange={handleChaptersChange}
          />
        ) : (
          <div style={{ backgroundColor: 'var(--card-2)', border: '1px dashed var(--border)', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.875rem' }}>
            Select one or more books above to choose specific chapters
          </div>
        )}

        {/* ── Task 3: Selected Chapter Badges/Pills ── */}
        {(data.chapters || []).length > 0 && (
          <SelectedChaptersList
            chapters={data.chapters}
            chapterMap={data.chapterMap || {}}
            removeChapter={removeChapter}
          />
        )}
      </div>
    </div>
  )
}
