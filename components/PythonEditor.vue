<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { EditorState } from '@codemirror/state'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { keymap } from '@codemirror/view'
import { CompletionContext } from '@codemirror/autocomplete'

const props = defineProps<{
  initialContent: string
  readonly?: boolean
  height?: string
  availableVariables?: Array<{ name: string, type: string, info: string }>
}>()

const emit = defineEmits<{
  'update:content': [value: string]
}>()

const editor = ref<EditorView>()
const editorElement = ref<HTMLElement>()

const pythonCompletions = (context: CompletionContext) => {
  const word = context.matchBefore(/\w*/)
  const dotMatch = context.matchBefore(/\w+\.\w*/)
  
  if (dotMatch) {
    // Handle method suggestions after a dot
    const beforeDot = dotMatch.text.split('.')[0]
    
    // If we're typing after a list/array variable
    if (beforeDot === 'numbers' || props.availableVariables?.some(v => v.name === beforeDot)) {
      return {
        from: dotMatch.from + beforeDot.length + 1,
        options: [
          { label: 'append', type: 'method', info: 'Add an element to the end of the list', apply: 'append()' },
          { label: 'extend', type: 'method', info: 'Add all elements of an iterable to the list', apply: 'extend()' },
          { label: 'insert', type: 'method', info: 'Insert an element at a given position', apply: 'insert()' },
          { label: 'remove', type: 'method', info: 'Remove first occurrence of a value', apply: 'remove()' },
          { label: 'pop', type: 'method', info: 'Remove and return item at index (default last)', apply: 'pop()' },
          { label: 'clear', type: 'method', info: 'Remove all items from the list', apply: 'clear()' },
          { label: 'index', type: 'method', info: 'Return first index of value', apply: 'index()' },
          { label: 'count', type: 'method', info: 'Return number of occurrences of value', apply: 'count()' },
          { label: 'sort', type: 'method', info: 'Sort the list in-place', apply: 'sort()' },
          { label: 'reverse', type: 'method', info: 'Reverse the list in-place', apply: 'reverse()' },
          { label: 'copy', type: 'method', info: 'Return a shallow copy of the list', apply: 'copy()' }
        ]
      }
    }
  }

  // Handle variable name suggestions
  if (word) {
    const options = []
    
    // Add Python built-ins
    options.push(
      { label: 'len', type: 'function', info: 'Return the length of an object' },
      { label: 'range', type: 'function', info: 'Create a sequence of numbers' },
      { label: 'print', type: 'function', info: 'Print objects to the text stream' },
      { label: 'sum', type: 'function', info: 'Sum of a sequence of numbers' },
      { label: 'min', type: 'function', info: 'Smallest item in an iterable' },
      { label: 'max', type: 'function', info: 'Largest item in an iterable' }
    )

    // Add user-defined variables
    if (props.availableVariables) {
      options.push(
        ...props.availableVariables.map(v => ({
          label: v.name,
          type: v.type,
          info: v.info
        }))
      )
    }

    return {
      from: word.from,
      options: options.filter(opt => 
        opt.label.toLowerCase().startsWith(word.text.toLowerCase())
      )
    }
  }

  return null
}

onMounted(() => {
  if (!editorElement.value) return

  const startState = EditorState.create({
    doc: props.initialContent,
    extensions: [
      basicSetup,
      python(),
      autocompletion({
        override: [pythonCompletions],
        defaultKeymap: true,
        icons: true
      }),
      keymap.of(completionKeymap),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const content = update.state.doc.toString()
          emit('update:content', content)
        }
      }),
      EditorView.theme({
        '&': {
          height: props.height || '200px',
          overflow: 'auto'
        },
        '.cm-scroller': {
          overflow: 'auto'
        }
      }),
      EditorState.readOnly.of(props.readonly || false)
    ]
  })

  editor.value = new EditorView({
    state: startState,
    parent: editorElement.value
  })
})

// Update editor content when initialContent prop changes
watch(() => props.initialContent, (newContent) => {
  if (editor.value && newContent !== editor.value.state.doc.toString()) {
    editor.value.dispatch({
      changes: {
        from: 0,
        to: editor.value.state.doc.length,
        insert: newContent
      }
    })
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div ref="editorElement" class="border rounded-lg overflow-hidden"></div>
</template>

<style>
.cm-editor {
  height: 100%;
}
.cm-editor.cm-focused {
  outline: none;
}
</style>
