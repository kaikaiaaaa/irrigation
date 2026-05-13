# Phase 4: Data Management - Context

**Gathered:** 2025-05-13
**Status:** Ready for planning

## Phase Boundary

Implement import/export functionality and storage safeguards. This phase ensures user data can be backed up, restored, and protected from storage issues.

**In scope:**
- Export device data as JSON file
- Import device data from JSON file
- LocalStorage quota checking
- Graceful handling of storage full errors
- Data validation on import
- Clear all data option

**Out of scope:**
- Cloud backup/sync (v2)
- Automatic backups (v2)
- Data encryption (v2)
- Multi-device sync (v2)

## Implementation Decisions

### Export
- **D-01:** Export all device data as formatted JSON
- **D-02:** Include metadata (export date, app version)
- **D-03:** Use browser download API for file save
- **D-04:** Filename: `irrigation-data-YYYY-MM-DD.json`

### Import
- **D-05:** File input with drag-and-drop support
- **D-06:** Validate JSON structure before import
- **D-07:** Show preview before confirming import
- **D-08:** Option to merge or replace existing data
- **D-09:** Error handling for invalid files

### Storage Safeguards
- **D-10:** Check LocalStorage quota before save
- **D-11:** Show warning when storage is 80% full
- **D-12:** Graceful error handling when quota exceeded
- **D-13:** Suggest export when storage is full

### UI
- **D-14:** Add Data Management section in Settings
- **D-15:** Export button with progress indicator
- **D-16:** Import button with file picker
- **D-17:** Clear all data with confirmation

## Canonical References

### Project Documents
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` — DAT-03~05
- `.planning/ROADMAP.md` — Phase 4 success criteria

### Phase 1-3 Artifacts
- `src/stores/deviceStore.ts` — Device data structure
- `src/types/device.ts` — Type definitions

## Existing Code Insights

### Reusable Assets
- Device store has full CRUD operations
- Device types are well-defined
- Zustand persist middleware handles LocalStorage

### Integration Points
- Settings page for data management UI
- Device store for data operations
- LocalStorage API for quota checking

## Specific Ideas

- Export button shows "正在准备数据..." then downloads
- Import shows file name and device count before confirming
- Validation checks: required fields, valid ranges
- Show storage usage bar in Settings
- Add "示例数据" button for first-time users

## Deferred Ideas

- Cloud sync (Google Drive, Dropbox)
- Automatic daily backups
- Data encryption
- Version migration for old exports

---

*Phase: 4-Data Management*
*Context gathered: 2025-05-13*
