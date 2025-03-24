<template>
  <div>
    <div class="mb-3">
      <o-field label="搜索 Search">
        <o-input v-model="search" placeholder="输入关键词搜索... Enter keywords to search..." expanded></o-input>
      </o-field>
    </div>
    
    <o-table
      :data="filteredData"
      :paginated="true"
      :per-page="10"
      v-model:current-page="currentPage"
      :pagination-simple="true"
      :pagination-position="'bottom'"
      :bordered="true"
      :striped="true"
      :narrowed="true"
      :hoverable="true"
      :mobile-cards="true"
    >
      <o-table-column field="name" label="姓名 Name" v-slot="props">
        {{ props.row?.name || '-' }}
      </o-table-column>
      
      <o-table-column field="email" label="电子邮件 Email" v-slot="props">
        {{ props.row?.email || '-' }}
      </o-table-column>
      
      <o-table-column field="age" label="年龄 Age" v-slot="props" numeric>
        {{ props.row?.age || '-' }}
      </o-table-column>
      
      <o-table-column field="gender" label="性别 Gender" v-slot="props">
        {{ props.row?.gender || '-' }}
      </o-table-column>
      
      <o-table-column field="occupation" label="职业 Occupation" v-slot="props">
        {{ props.row?.occupation || '-' }}
      </o-table-column>
      
      <o-table-column field="languages" label="编程语言 Programming Languages" v-slot="props">
        {{ props.row?.languages?.join(', ') || '-' }}
      </o-table-column>
      
      <o-table-column field="satisfaction" label="满意度 Satisfaction" v-slot="props" numeric>
        <o-progress
          v-if="props.row?.satisfaction"
          :value="props.row.satisfaction"
          :max="10"
          :variant="getSatisfactionColor(props.row.satisfaction)"
        >
          {{ props.row.satisfaction }}/10
        </o-progress>
        <span v-else>-</span>
      </o-table-column>
      
      <o-table-column field="feedback" label="反馈 Feedback" v-slot="props">
        <span v-if="props.row?.feedback" class="feedback-text">
          {{ truncateText(props.row.feedback, 30) }}
          <o-tooltip :label="props.row.feedback" position="top" multilined>
            <o-icon icon="information-circle"></o-icon>
          </o-tooltip>
        </span>
        <span v-else>-</span>
      </o-table-column>
      
      <template #empty>
        <div class="has-text-centered">没有找到匹配的数据 No matching data found</div>
      </template>
    </o-table>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'ResponsesTable',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const search = ref('');
    const currentPage = ref(1);
    
    const filteredData = computed(() => {
      if (!search.value) return props.data;
      
      const searchTerm = search.value.toLowerCase();
      return props.data.filter(item => {
        return (
          (item.name && item.name.toLowerCase().includes(searchTerm)) ||
          (item.email && item.email.toLowerCase().includes(searchTerm)) ||
          (item.gender && item.gender.toLowerCase().includes(searchTerm)) ||
          (item.occupation && item.occupation.toLowerCase().includes(searchTerm)) ||
          (item.feedback && item.feedback.toLowerCase().includes(searchTerm)) ||
          (item.languages && item.languages.some(lang => lang.toLowerCase().includes(searchTerm))) ||
          (item.age && item.age.toString().includes(searchTerm)) ||
          (item.satisfaction && item.satisfaction.toString().includes(searchTerm))
        );
      });
    });
    
    const getSatisfactionColor = (satisfaction) => {
      if (satisfaction <= 3) return 'danger';
      if (satisfaction <= 6) return 'warning';
      if (satisfaction <= 8) return 'info';
      return 'success';
    };
    
    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    
    return {
      search,
      currentPage,
      filteredData,
      getSatisfactionColor,
      truncateText
    };
  }
}
</script>

<style scoped>
.feedback-text {
  display: flex;
  align-items: center;
}
</style>