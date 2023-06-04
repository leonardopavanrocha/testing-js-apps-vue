import { mount } from '@vue/test-utils';
import SearchBar from '@/components/SearchBar';

describe('SearchBar - unit', () => {
  it('should mount the component', () => {
    const wrapper = mount(SearchBar);
    expect(wrapper.vm).toBeDefined();
  });

  it('should emit search when form is submitted', async () => {
    const wrapper = mount(SearchBar);
    const term = 'watch';
    await wrapper.find('input[type="text"]').setValue(term);
    wrapper.find('form').trigger('submit');

    expect(wrapper.emitted().search).toBeTruthy();
    expect(wrapper.emitted().search.length).toEqual(1);
    expect(wrapper.emitted().search[0]).toEqual([{ term }]);
  });

  it('should emit search when form is cleared', async () => {
    const wrapper = mount(SearchBar);
    const searchInput = wrapper.find('input[type="text"]');
    const term = 'watch';
    await searchInput.setValue(term);
    await searchInput.setValue('');

    expect(wrapper.emitted().search).toBeTruthy();
    expect(wrapper.emitted().search.length).toEqual(1);
    expect(wrapper.emitted().search[0]).toEqual([{ term: '' }]);
  });
});
