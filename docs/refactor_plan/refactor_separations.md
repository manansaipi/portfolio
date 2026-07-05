# Clean Code Analysis & Refactoring Plan: BlogDetail.jsx

## 1. Deep Analysis of Current `BlogDetail.jsx`
The current `BlogDetail.jsx` file is 454 lines long and handles multiple responsibilities. According to Robert C. Martin's "Clean Code" principles, a module or component should follow the **Single Responsibility Principle (SRP)**—it should have only one reason to change. 

### Code Smells & Issues Identified:
- **God Component / Bloater**: The component does too much. It manages API calls, local storage synchronization, complex comment interactions (like, edit, delete, reply), context consumption, and heavy UI rendering.
- **Mixed Levels of Abstraction**: High-level UI structure is mixed with low-level DOM manipulation (e.g., `imageRef.current.classList.remove("z-7")`) and raw `localStorage` read/writes.
- **Embedded Render Functions**: `renderComment` is a complex, recursive UI rendering function defined inside the main component body. It makes the file harder to read and breaks component isolation.
- **Utility Logic inside Component**: `resolveImg` is a pure utility function placed inside the component instead of a shared utility file.
- **Too Many States**: The component uses 10 different `useState` hooks, making it hard to track state changes and dependencies.

## 2. Proposed Architecture (Separation of Concerns)
To make the code clean, lean, and easy to maintain, we will separate the logic from the view by restructuring the `BlogDetail` directory:

```text
src/pages/Blog/components/BlogDetail/
├── index.jsx                  (Entry point)
├── BlogDetail.jsx             (Main view component - clean & declarative)
├── useBlogDetail.js           (Custom hook containing all business logic/state)
└── components/
    ├── BlogHeader.jsx         (Hero image, title, and author metadata)
    ├── CommentSection.jsx     (Handles the comment input and list container)
    └── CommentItem.jsx        (Replaces the recursive renderComment function)
```
*(If `resolveImg` is used elsewhere, we move it to `src/utils/imageHelpers.js`)*

## 3. Step-by-Step Refactoring Plan

### Phase 1: Extract Utilities (Pure Functions)
**Action**: Move `resolveImg` out of the component.
- **Where**: Place it at the top of the file outside the component, or in a shared `src/utils` file if applicable.
- **Why**: It is a pure function that doesn't depend on component state. 

### Phase 2: Create Custom Hook (`useBlogDetail.js`)
**Action**: Extract all React hooks (`useState`, `useEffect`, `useLayoutEffect`, etc.) and event handlers into a custom hook.
- **Contents to move**:
  - All state declarations (`currentBlog`, `comment`, `likedComments`, `userName`, etc.)
  - All side effects (fetching the blog, syncing `localStorage`, layout effects)
  - All handler functions (`handleDeleteComment`, `handleEditComment`, `toggleLike`, `handleSubmitRespond`, etc.)
- **Return Value**: The hook will return an object containing the state variables and handler functions required by the UI.
- **Why**: This separates the "How it works" (Logic/Behavior) from the "How it looks" (UI/Presentation).

### Phase 3: Extract Sub-Components
**Action**: Break down the large JSX return block.
1. **`CommentItem.jsx`**:
   - Extract the JSX returned by the current `renderComment` function into a standalone component.
   - Pass necessary data as props (the `commentObj`, `likedComments` state, and the handlers from the hook).
   - Handle the nested replies cleanly by rendering `<CommentItem />` inside itself.
2. **`CommentSection.jsx`**:
   - Encapsulate the entire responses section (the "Responses" title, the input area, and mapping over `dataComments`).
3. **`BlogHeader.jsx`** (Optional but recommended):
   - Extract the image header, the title, and the author metadata display.

### Phase 4: Reassemble `BlogDetail.jsx`
**Action**: Reconstruct the main view component.
- The new `BlogDetail.jsx` will be extremely clean. It will call `useBlogDetail()` to get the necessary props, and then render the extracted components.
- **Example Outcome**:
  ```jsx
  const BlogDetail = () => {
      const { blogId } = useParams();
      const blogData = useBlogDetail(blogId);

      if (!blogData.currentBlog) return <BlogNotFound handleNavigate={blogData.handleButtonNavigation} />;

      return (
          <div className="min-h-screen bg-background text-primary pb-50">
              <BlogHeader blog={blogData.currentBlog} imageRef={blogData.imageRef} />
              <BlogContent content={blogData.currentBlog.content} />
              <CommentSection 
                  comments={blogData.dataComments} 
                  handlers={blogData.handlers} 
                  userState={blogData.userState} 
              />
          </div>
      );
  };
  ```

## 4. Execution Rules
- **No Logic Changes**: The inner workings of fetching, liking, editing, and deleting must remain functionally identical.
- **Preserve Styling**: All Tailwind CSS classes and HTML structures must be preserved perfectly so the UI does not change visually.
- **Maintain Prop Drilling to a Minimum**: Only pass the specific handlers and state variables that a child component actually needs.
