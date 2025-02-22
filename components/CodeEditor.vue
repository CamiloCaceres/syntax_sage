<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
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

const myCompletions = (context: CompletionContext) => {
  const word = context.matchBefore(/\w*/)
  const dotMatch = context.matchBefore(/\w+\.\w*/)
  
  if (dotMatch) {
    // Handle method suggestions after a dot
    const beforeDot = dotMatch.text.split('.')[0]
    
    // If we're typing after 'numbers.' or any other array variable
    if (beforeDot === 'numbers') {
      return {
        from: dotMatch.from + beforeDot.length + 1,
        options: [
          { label: 'push', type: 'method', info: 'Adds elements to the end of an array', apply: 'push()' },
          { label: 'pop', type: 'method', info: 'Removes the last element from an array', apply: 'pop()' },
          { label: 'shift', type: 'method', info: 'Removes the first element from an array', apply: 'shift()' },
          { label: 'unshift', type: 'method', info: 'Adds elements to the beginning of an array', apply: 'unshift()' },
          { label: 'slice', type: 'method', info: 'Returns a shallow copy of a portion of an array', apply: 'slice()' },
          { label: 'splice', type: 'method', info: 'Changes the contents of an array by removing or replacing elements', apply: 'splice()' },
          { label: 'indexOf', type: 'method', info: 'Returns the first index at which a given element can be found', apply: 'indexOf()' },
          { label: 'includes', type: 'method', info: 'Determines whether an array includes a certain value', apply: 'includes()' },
          { label: 'join', type: 'method', info: 'Creates and returns a new string by concatenating all elements', apply: 'join()' },
          { label: 'map', type: 'method', info: 'Creates a new array with the results of calling a function', apply: 'map()' },
          { label: 'filter', type: 'method', info: 'Creates a new array with all elements that pass the test', apply: 'filter()' },
          { label: 'reduce', type: 'method', info: 'Reduces an array to a single value', apply: 'reduce()' },
          { label: 'forEach', type: 'method', info: 'Executes a provided function once for each array element', apply: 'forEach()' },
          { label: 'sort', type: 'method', info: 'Sorts the elements of an array', apply: 'sort()' },
          { label: 'reverse', type: 'method', info: 'Reverses the order of the elements in an array', apply: 'reverse()' },
          { label: 'length', type: 'property', info: 'Returns the number of elements in the array' }
        ]
      }
    }
  }

  // Handle variable name suggestions
  if (word) {
    const options = []
    
    // Add known variables
    options.push(
      ...(props.availableVariables?.map(v => ({
        label: v.name,
        type: v.type,
        info: v.info
      })) || [])
    )

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
      javascript(),
      autocompletion({
        override: [myCompletions],
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