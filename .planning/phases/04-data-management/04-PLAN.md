# Plan: Phase 4 - Data Management

**Phase:** 4 - Data Management
**Date:** 2025-05-13
**Status:** Ready for execution

## Overview

Implement import/export functionality and storage safeguards to protect user data.

## Requirements Covered

- DAT-03: Export device data as JSON file
- DAT-04: Import device data from JSON file
- DAT-05: Handle LocalStorage quota exceeded gracefully

## Plans

### Plan 1: Export Functionality
**Wave:** 1
**Depends on:** None
**Files Modified:**
- `src/utils/exportImport.ts`
- `src/pages/Settings/index.tsx`

**Tasks:**

1. **Create Export Utility**
   - `exportDevices()` function
   - Format data with metadata (version, date, app info)
   - Generate filename with timestamp
   - Create and download JSON file
   - Handle errors

2. **Update Settings Page**
   - Add "导出数据" button
   - Show export progress/status
   - Display last export time

### Plan 2: Import Functionality
**Wave:** 1
**Depends on:** Plan 1
**Files Modified:**
- `src/utils/exportImport.ts`
- `src/components/common/FileUpload.tsx`
- `src/pages/Settings/index.tsx`

**Tasks:**

1. **Create Import Utility**
   - `importDevices()` function
   - Parse and validate JSON
   - Check data structure
   - Validate device fields
   - Return validation results

2. **Create FileUpload Component**
   - File input with drag-and-drop
   - Show selected file info
   - Validation status
   - Import preview

3. **Update Settings Page**
   - Add "导入数据" section
   - Show import preview (device count)
   - Confirm before replacing data
   - Show import result

### Plan 3: Storage Safeguards
**Wave:** 2
**Depends on:** None
**Files Modified:**
- `src/utils/storage.ts`
- `src/stores/deviceStore.ts`
- `src/pages/Settings/index.tsx`

**Tasks:**

1. **Create Storage Utilities**
   - `checkStorageQuota()` function
   - Calculate used/remaining space
   - Estimate device data size
   - Return storage status

2. **Update Device Store**
   - Check quota before save
   - Show warning at 80% capacity
   - Handle quota exceeded errors
   - Suggest export when full

3. **Update Settings Page**
   - Show storage usage bar
   - Display used/total space
   - Warning when low on space
   - "清理数据" option

### Plan 4: Clear Data
**Wave:** 2
**Depends on:** Plan 3
**Files Modified:**
- `src/pages/Settings/index.tsx`
- `src/stores/deviceStore.ts`

**Tasks:**

1. **Add Clear Data Function**
   - `clearAllData()` action in store
   - Reset to initial state
   - Keep demo data option

2. **Update Settings UI**
   - "清除所有数据" button
   - Confirmation dialog
   - Warning about irreversible action
   - Option to export first

## Verification Criteria

- [ ] Export creates valid JSON file
- [ ] Import restores data correctly
- [ ] Invalid import files show error
- [ ] Storage quota check works
- [ ] Warning shows at 80% capacity
- [ ] Clear data removes all devices
- [ ] Chinese labels throughout
- [ ] Build passes without errors
- [ ] All existing tests still pass

## Must-Haves

1. Export to JSON file
2. Import from JSON file
3. Data validation
4. Storage quota check
5. Clear data option

## Notes

- Keep export format simple and documented
- Import should be forgiving (ignore extra fields)
- Always suggest export before clear
- Test with large datasets
